const { app, BrowserWindow, ipcMain, clipboard, Tray, Menu, nativeImage } = require('electron');
const path = require('node:path');

let win;
let tray;

function createWindow() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));

  win = new BrowserWindow({
    width: 480,
    height: 400,
    minWidth: 200,
    minHeight: 150,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');

  // Close button hides to tray instead of quitting
  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, 'icon-16.png'));
  tray = new Tray(trayIcon);
  tray.setToolTip('stickyIMG');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Goster',
      click: () => {
        win.show();
        win.focus();
      }
    },
    { type: 'separator' },
    {
      label: 'Kapat',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Left-click on tray restores the window
  tray.on('click', () => {
    win.show();
    win.focus();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // IPC: Read clipboard image and return as data URL
  ipcMain.handle('paste-image', () => {
    const image = clipboard.readImage();
    if (image.isEmpty()) return null;
    return image.toDataURL();
  });

  // IPC: Toggle always-on-top and return new state
  ipcMain.handle('toggle-pin', () => {
    const current = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!current);
    return !current;
  });

  // IPC: Window controls
  ipcMain.on('window-minimize', () => {
    win.minimize();
  });

  ipcMain.on('window-close', () => {
    win.close();
  });
});

app.on('window-all-closed', () => {
  // Don't quit — tray keeps running
});
