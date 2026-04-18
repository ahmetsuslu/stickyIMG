# stickyIMG

Always-on-top clipboard image viewer for Windows. Take a screenshot with **Win+Shift+S**, paste it with **Ctrl+V**, and keep it floating on your screen while you work.

![Electron](https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Always on top** — Window stays above all other windows
- **Ctrl+V paste** — Paste clipboard screenshots instantly
- **Mouse wheel zoom** — Scroll to zoom in/out, centered on cursor
- **Drag to pan** — Click and drag to navigate zoomed images
- **System tray** — Close button minimizes to tray, right-click tray to quit
- **Pin toggle** — Toggle always-on-top from the title bar
- **Frameless dark UI** — Clean, minimal design

## Download

Go to [Releases](https://github.com/ahmetsuslu/stickyIMG/releases) and download **stickyIMG.exe**. No installation required — just run it.

## Usage

1. Run `stickyIMG.exe`
2. Take a screenshot with **Win+Shift+S**
3. Press **Ctrl+V** in the stickyIMG window
4. **Scroll** to zoom in/out
5. **Drag** to pan when zoomed in
6. Click **X** to minimize to system tray
7. Right-click tray icon → **Kapat** to quit

## Build from Source

```bash
git clone https://github.com/ahmetsuslu/stickyIMG.git
cd stickyIMG
npm install
npm start          # run in dev mode
npm run build      # build portable exe → dist/stickyIMG.exe
```

## Tech Stack

- [Electron](https://www.electronjs.org/) 33
- Vanilla JS, HTML, CSS
- [electron-builder](https://www.electron.build/) (portable target)
