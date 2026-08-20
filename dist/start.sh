#!/bin/bash

# Media Downloader
# Server: http://localhost:3000

# Get the directory of the current script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "============================================"
echo "  Media Downloader"
echo "  Server: http://localhost:3000"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js tidak ditemukan!"
    echo "Install via package manager atau dari https://nodejs.org"
    read -p "Press enter to exit..."
    exit 1
fi

# Check npm deps
if [ ! -d "node_modules" ]; then
    echo "[INFO] Menginstall dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        read -p "Press enter to exit..."
        exit 1
    fi
fi

# Check yt-dlp
if ! python3 -c "import yt_dlp" &> /dev/null; then
    echo "[INFO] Menginstall yt-dlp..."
    python3 -m pipx install yt-dlp
fi

# Check ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "[WARNING] ffmpeg tidak ditemukan."
    echo "Audio download dan merge video mungkin gagal."
    echo "Install via package manager (contoh: sudo apt install ffmpeg)"
    echo ""
fi

echo ""
echo "Server starting... Buka http://localhost:3000"
echo ""

# Open browser (xdg-open is the Linux equivalent of 'start')
xdg-open "http://localhost:3000" &> /dev/null &

# Start application
npm start

read -p "Press enter to continue..."

