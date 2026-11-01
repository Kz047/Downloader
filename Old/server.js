const express = require('express');
const cors = require('cors');
const { spawn, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname));

const YT_DLP = [
  'python', 
  '-m', 
  'yt_dlp',
  '--user-agent',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  '--extractor-args',
  'youtube:player_client=ios,android,web'
];

function sanitizeFilename(name) {
  // Removes characters that are illegal in Windows/Linux file paths, and strips newlines
  return name.replace(/[<>:"/\\|?*\n\r]/g, '_').substring(0, 200);
}

function isThreads(url) {
  return /threads\.(com|net)/i.test(url);
}

async function threadsFetchInfo(url) {
  const resp = await fetch('https://lovethreads.net/api/ajaxSearch', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://lovethreads.net',
      referer: 'https://lovethreads.net/en',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: new URLSearchParams({ q: url, t: 'media', lang: 'en' })
  });
  const data = await resp.json();
  if (data.status !== 'ok') throw new Error('Failed to fetch media from Threads');
  return data;
}

function parseThreadsHtml(html) {
  const videos = [];
  const liRegex = /<li>.*?<\/li>/gis;
  let liMatch;
  while ((liMatch = liRegex.exec(html)) !== null) {
    const li = liMatch[0];
    if (/icon-dlvideo/i.test(li)) {
      const thumbMatch = li.match(/<img[^>]*src="([^"]+)"/i);
      const urlMatch = li.match(/<a[^>]*href="([^"]+)"[^>]*title="Download Video"/i) || li.match(/<a[^>]*title="Download Video"[^>]*href="([^"]+)"/i);
      if (urlMatch) {
        videos.push({
          thumbnail: thumbMatch ? thumbMatch[1] : '',
          url: urlMatch[1]
        });
      }
    }
  }
  return videos;
}

app.post('/api/info', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  if (isThreads(url)) {
    try {
      const result = await threadsFetchInfo(url);
      const videos = parseThreadsHtml(result.data || '');
      const firstVideo = videos[0] || {};
      const titleMatch = result.data.match(/<title[^>]*>([^<]+)<\/title>/i) || result.title;
      res.json({
        isPlaylist: false,
        title: titleMatch ? titleMatch[1]?.trim() : 'Threads Video',
        thumbnail: firstVideo.thumbnail || '',
        duration: null,
        resolution: null,
        ext: 'mp4',
        formats: videos.map((v, i) => ({
          format_id: `video_${i}`,
          ext: 'mp4',
          resolution: `Video ${i + 1}`,
          filesize: 0,
          url: v.url
        })),
        _threadsVideos: videos
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
    return;
  }

  const args = [...YT_DLP, '--dump-single-json', '--no-download', '--flat-playlist', url];
  const proc = execFile(args[0], args.slice(1), {
    timeout: 45000,
    maxBuffer: 20 * 1024 * 1024
  }, (err, stdout, stderr) => {
    if (err) {
      const msg = stderr.split('\n').filter(l => l.trim()).pop() || err.message;
      return res.status(400).json({ error: msg });
    }
    try {
      const d = JSON.parse(stdout);
      
      if (d._type === 'playlist' || d.entries) {
        const entries = (d.entries || [])
          .filter(e => e.url || e.original_url || e.webpage_url || e.id)
          .map(e => ({
            id: e.id,
            title: e.title || 'Untitled',
            url: e.url || e.original_url || e.webpage_url || `https://www.youtube.com/watch?v=${e.id}`,
            duration: e.duration || null
          }));

        return res.json({
          isPlaylist: true,
          title: d.title || 'Playlist',
          thumbnail: d.thumbnails && d.thumbnails.length ? d.thumbnails[0].url : '',
          entries: entries
        });
      }

      res.json({
        isPlaylist: false,
        title: d.title || 'Untitled',
        thumbnail: d.thumbnail || '',
        duration: d.duration || null,
        resolution: d.resolution || d.height ? `${d.height}p` : null,
        ext: d.ext || 'mp4',
        formats: (d.formats || []).map(f => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.height ? `${f.height}p` : 'audio',
          filesize: f.filesize || f.filesize_approx || 0,
          url: f.url,
          vcodec: f.vcodec,
          acodec: f.acodec
        }))
      });
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse media details.' });
    }
  });
});

app.post('/api/download', async (req, res) => {
  const { url, type, format_id, filename } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const baseName = filename ? sanitizeFilename(filename) : 'download';

  if (isThreads(url)) {
    try {
      const result = await threadsFetchInfo(url);
      const videos = parseThreadsHtml(result.data || '');
      let videoUrl = videos[0]?.url;
      if (format_id && format_id.startsWith('video_')) {
        const idx = parseInt(format_id.replace('video_', ''), 10);
        if (!isNaN(idx) && videos[idx]) videoUrl = videos[idx].url;
      }
      if (!videoUrl) throw new Error('No valid video found for download');

      const resp = await fetch(videoUrl);
      if (!resp.ok) throw new Error('Failed to fetch video file for download');

      // FIXED: Properly encode the filename for HTTP headers
      const encodedFilename = encodeURIComponent(`${baseName}.mp4`);
      res.setHeader('Content-Disposition', `attachment; filename="media.mp4"; filename*=UTF-8''${encodedFilename}`);
      res.setHeader('Content-Type', 'video/mp4');
      Readable.fromWeb(resp.body).pipe(res);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
    return;
  }

  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const tmpFile = path.join(os.tmpdir(), `dl-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);

  let args;
  if (type === 'audio') {
    args = [...YT_DLP, '-x', '--audio-format', 'mp3', '--audio-quality', '0', '--embed-metadata', '--embed-thumbnail', '-o', tmpFile, url];
  } else if (format_id && format_id.endsWith('p')) {
    const height = format_id.replace('p', '');
    args = [...YT_DLP, '-f', `bestvideo[height<=${height}]+bestaudio/best`, '--remux-video', 'mp4', '-o', tmpFile, url];
  } else if (format_id) {
    args = [...YT_DLP, '-f', `${format_id}+bestaudio[ext=m4a]/best[ext=mp4]`, '--remux-video', 'mp4', '-o', tmpFile, url];
  } else {
    args = [...YT_DLP, '-f', 'best[ext=mp4]/best', '-o', tmpFile, url];
  }

  const proc = spawn(args[0], args.slice(1), {
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 900000 
  });

  let stderrBuf = '';
  proc.stderr.on('data', (chunk) => { stderrBuf += chunk.toString(); });

  proc.on('error', () => {
    res.status(500).json({ error: 'Failed to start download process on server.' });
    try { fs.unlinkSync(tmpFile); } catch (_) {}
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      const msg = stderrBuf.split('\n').filter(l => l.trim()).pop() || 'Internal Download failure';
      res.status(400).json({ error: msg });
      try { fs.unlinkSync(tmpFile); } catch (_) {}
      return;
    }
    
    // FIXED: Properly encode the filename for HTTP headers
    const encodedFilename = encodeURIComponent(`${baseName}.${ext}`);
    res.setHeader('Content-Disposition', `attachment; filename="media.${ext}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');
    
    const stream = fs.createReadStream(tmpFile);
    stream.pipe(res);
    
    stream.on('end', () => {
      try { fs.unlinkSync(tmpFile); } catch (_) {}
    });
    stream.on('error', () => {
      try { fs.unlinkSync(tmpFile); } catch (_) {}
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
