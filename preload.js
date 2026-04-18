const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  pasteImage: () => ipcRenderer.invoke('paste-image'),
  togglePin: () => ipcRenderer.invoke('toggle-pin'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close')
});
