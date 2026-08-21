


# DownloaderHub

Aplikasi untuk mengunduh video dan audio dari **YouTube, Facebook, Instagram, TikTok, X (Twitter), dan Threads**. 

Mendukung pengunduhan *batch/playlist*, riwayat unduhan, penanaman metadata audio (Album Art), dan antarmuka *Smart Paste* langsung dari browser.

![Preview](https://img.shields.io/badge/Platform-Web-teal)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)


## Yang Perlu Disiapkan

Sebelum memulai, pastikan komputer sudah terinstal 3 hal ini:

### 1. Node.js
Cek dengan membuka terminal atau *Command Prompt*, ketik:
```bash
node --version

```

Jika muncul `node not recognized` — download dan install versi LTS dari https://nodejs.org.

### 2. Python

Cek dengan:

```bash
python --version

```

Jika belum ada, download dari https://www.python.org/downloads/. **(Wajib centang "Add Python to PATH" saat install di Windows).**

### 3. FFmpeg

Cek dengan:

```bash
ffmpeg -version

```

Jika belum ada, gunakan *package manager* sesuai OS:

* **Windows:** `winget install "FFmpeg (Essentials Build)"`
* **macOS:** `brew install ffmpeg`
* **Linux (Debian/Ubuntu):** `sudo apt install ffmpeg`
* **Linux (Arch/CachyOS):** `sudo pacman -S ffmpeg`

---

## Jangan lupa install yang diperlukan 👍

Buka terminal di folder proyek ini, lalu jalankan perintah berikut:

```bash
# 1. Install dependensi Node.js
npm install

# 2. Install yt-dlp dan mutagen (wajib untuk fitur metadata audio / cover art)
python -m pip install yt-dlp mutagen

```

---

## Cara Menjalankan

### Opsi 1: Klik Dua Kali(Double Click) (Windows)

Jalankan `dist/MediaDownloader.exe` atau `dist/start.bat`.

### Opsi 2: Melalui Terminal

```bash
npm start

```

Bila muncul `Server running at http://localhost:3000`, buka *browser* dan akses alamat tersebut.

---


### 📱 Menjalankan DownloaderHub di Android (via Termux)

Kamu juga bisa menjalankan aplikasi ini langsung di HP Android menggunakan aplikasi **Termux** tanpa harus menyalakan PC/Laptop.

#### 1. Persiapan Awal di Termux

Buka aplikasi Termux (Unduh Aplikasi Termux Pada Bagian Catatan Tambahan Di Bawah). Lalu jalankan perintah berikut satu per satu:

```bash
# Update dan upgrade sistem Termux
pkg update && pkg upgrade

# Berikan izin akses penyimpanan (agar file hasil download bisa disimpan ke HP)
termux-setup-storage

# Install dependensi utama (Python, Node.js, Git, dan FFmpeg)
pkg install python nodejs git ffmpeg

```

#### 2. Download (Clone) Repository dari GitHub

Kloning repositori DownloaderHub yang sudah kamu buat langsung ke dalam Termux:

```bash
# Clone repo GitHub kamu (ganti URL jika diperlukan)
git clone https://github.com/Kz047/Downloader.git

# Masuk ke folder proyek
cd Downloader

```

#### 3. Install Modul yang Dibutuhkan

Instal pustaka Node.js dan pustaka Python (`yt-dlp` serta `mutagen`):

```bash
# Install paket Node.js
npm install

# Install yt-dlp dan mutagen untuk metadata audio
pip install -U yt-dlp mutagen

```

#### 4. Menjalankan Server

Nyalakan server aplikasi dengan perintah:

```bash
npm start

```

Jika berhasil, akan muncul tulisan:
`Server running at http://localhost:3000`

#### 5. Cara Mengakses

Buka *browser* HP (seperti Chrome atau Firefox) dan ketik alamat berikut di *url bar*:

```
http://localhost:3000

```

Sekarang, DownloaderHub siap digunakan langsung dari HP Android kamu!

---

* **Smart Paste:** Salin tautan video/playlist. Di halaman web, kamu bisa langsung menekan `Ctrl+V` atau klik ikon **Paste** di dalam kolom pencarian. Link otomatis dikenali dan tombol platform akan menyala dengan warna *teal* (hijau toska).
* **Fetch:** Sistem akan memproses media secara otomatis. Jika kamu memasukkan link *playlist*, antarmuka *Batch Selection* akan terbuka.
* **Pilih Resolusi:** Klik salah satu *chip* resolusi (misal 1080p). *Chip* terpilih akan menjadi hitam/teal. Jika tidak memilih, sistem akan mengunduh resolusi terbaik secara otomatis.
* **Download:** Klik **Save Video** (.mp4) atau **Save Audio** (.mp3). File akan terunduh dengan metadata yang rapi.
* **History:** Klik ikon jam di sudut kanan atas untuk melihat dan mengunduh ulang riwayat media sebelumnya.

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
| --- | --- | --- |
| **Error "Unexpected response" di TikTok** | Pembaruan anti-bot dari TikTok | Kode sudah diperbarui untuk menggunakan *User-Agent* Chrome. Pastikan menggunakan kode `server.js` versi terbaru. |
| **Server Crash saat nama file unik/emoji** | *Header HTTP* tidak valid | Kode telah menggunakan RFC 5987 (`UTF-8`) untuk penamaan file. Pastikan menggunakan `server.js` terbaru. |
| **Video tidak bisa diputar** | Proses *merge* gagal | Coba pilih resolusi lebih rendah, atau biarkan kosong (auto). |
| **Audio tidak memiliki Cover Art** | Modul `mutagen` belum terinstal | Jalankan `pip install mutagen` di terminal. |
| **Download lambat** | Limitasi server sumber | Tunggu prosesnya, gunakan jaringan yang stabil. |

---
## Catatan Tambahan

## Android
Untuk Android Dapatkan Aplikasi Termux Pada [F-Droid](https://f-droid.org/packages/com.termux/) atau [GitHub Resmi Termux](https://github.com/termux/termux-app)
Untuk menjalankan program kembali ketik :
```
cd Downloader
npm start
```
---

## Lisensi

MIT — bebas pakai, modifikasi, dan distribusi.
