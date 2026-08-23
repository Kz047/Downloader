
```
# 🎬 All In One Downloader

**Download anything. Play anything. All in one sleek interface.**

A powerful, cross-platform web application to download videos and audio from **YouTube, Facebook, Instagram, TikTok, and X (Twitter)**, plus a built-in **YouTube Music scraper** for discovering and streaming music directly in the browser.

With a modern, customizable dark UI, batch playlist support, automatic audio metadata (Album Art), and a smart-paste clipboard feature, this is your ultimate media toolkit.
---
```
![Preview](https://img.shields.io/badge/Platform-Web-teal)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)



## ✨ Key Features

- **🎥 Universal Media Download** – Supports 5 major platforms: YouTube, Facebook, Instagram, TikTok, and X (Twitter).
- **🎵 YouTube Music Scraper** – Search, stream, and download music directly from YouTube Music with live previews.
- **🎧 Built-in Music Player** – Stream songs with a spinning vinyl animation, seek bar, volume control, and a minimized floating player.
- **📦 Batch / Playlist Support** – Paste a playlist link to automatically open a "Batch Selection" interface for multiple downloads.
- **🗂️ Download History** – A dedicated "Recent" tab keeps track of all your past downloads for quick re-downloading (saved locally, up to 50 items).
- **🎨 Smart Paste** – Just copy a link (`Ctrl+V`) and the app automatically detects the platform, highlighting the correct button.
- **🖼️ Automatic Metadata** – Embeds high-quality album art and correct tags into your MP3 files (powered by `mutagen`).
- **🎨 Fully Customizable UI** – Personalize the app with 7 themes (System, Black, White, Dark, Ocean, Purple, Forest) and 4 accent colors (Teal Glow, Electric Blue, Neon Pink, Cyber Yellow).
- **🔍 Smart URL Detection** – Automatically recognizes the platform from the pasted link and highlights the correct filter chip.
- **💾 Skeleton Loading States** – Beautiful shimmering skeletons while fetching media info for a polished experience.
- **📱 Mobile-Ready (Termux)** – Run the entire server directly on your Android phone without a PC.

---

## 🚀 Quick Start (PC)

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/downloads/) 3.8+ (with "Add to PATH" checked)
- [FFmpeg](https://ffmpeg.org/) (Install via your package manager)

### Installation
```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python packages (required for metadata & downloads)
python -m pip install yt-dlp mutagen

# 3. Start the server
npm start
```

Open `http://localhost:3000` in your browser.

---

## 🤖 Run on Android (Termux)

Want to download media on the go? Follow these steps inside the Termux app:

```bash
# Update & setup
pkg update && pkg upgrade
termux-setup-storage
pkg install python nodejs git ffmpeg

# Clone & install
git clone https://github.com/Kz047/Downloader.git
cd Downloader
npm install
pip install -U yt-dlp mutagen

# Launch
npm start
```

Then open `http://localhost:3000` in your Android browser.

---

## 🖱️ Usage Guide

1. **Smart Paste:** The icon that you can click to paste :D .
2. **Fetch:** The system processes the link automatically, or just press enter if it doesn't. For playlists, the batch selection window opens.
3. **Select Quality:** Click a resolution chip (e.g., 1080p, 4K, 720p).
4. **Download:** Click **Save Video** (.mp4) or **Save Audio** (.mp3). Files are saved with metadata embedded(yay).
5. **History:** Click the clock icon (top-right) to view past downloads and re-download them anytime(wowie zowie).

---

## 🛡️ Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **TikTok "Unexpected response"** | TikTok anti-bot updates | Ensure you are on the latest `server.js` (uses Chrome User-Agent). |
| **Server crash on emoji filenames** | Invalid HTTP headers | Updated to RFC 5987 (UTF-8); use latest `server.js`. |
| **Video won't play** | Merge failure | uhh try selecting lower resolution HOPE IT WORKS !! or just try updating yt-dlp |
| **No cover art on MP3** | `mutagen` missing | Run `pip install mutagen`. |
any other issues could easily be fixed by updating yt-dlp, if it does not work however sent a issue! :D
---

## 📄 License

MIT — Free to use, modify, and distribute.

---
