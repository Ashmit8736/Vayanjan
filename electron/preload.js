const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // App info
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),

    // Window Control
    loginSuccess: () => ipcRenderer.send('app:loginSuccess'),
    logout: () => ipcRenderer.send('app:logout'),
});
