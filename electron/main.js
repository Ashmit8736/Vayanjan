const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

let mainWindow;

// Create the main application window
function createWindow() {
    // Prevent multiple windows - reuse existing window if available
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.reload();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 1100, // Wider for split screen
        height: 700,
        resizable: false, // Keep fixed for login
        maximizable: false,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        icon: path.join(__dirname, '../build/icon.png'),
        show: false,
        autoHideMenuBar: true, // Hide default menu bar
    });



    // Remove menu bar completely (optional, if autoHide isn't enough)
    mainWindow.setMenuBarVisibility(false);

    // Set Content Security Policy (relaxed for development)
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    process.env.NODE_ENV === 'development'
                        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:5173 ws://localhost:5173 http://localhost:5000;"
                        : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:5000;"
                ]
            }
        });
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load from app resources
        const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
        mainWindow.loadFile(indexPath);
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('app:getVersion', () => {
    return app.getVersion();
});

ipcMain.handle('app:getPlatform', () => {
    return process.platform;
});

// Handle Login Success -> Maximize Window
ipcMain.on('app:loginSuccess', () => {
    if (mainWindow) {
        mainWindow.setResizable(true);
        mainWindow.setMaximizable(true);
        mainWindow.setMinimumSize(1024, 768); // Set min size for dashboard
        mainWindow.maximize();
        mainWindow.center();
    }
});

// Handle Logout -> Login Window Size
ipcMain.on('app:logout', () => {
    if (mainWindow) {
        mainWindow.unmaximize();
        mainWindow.setResizable(false);
        mainWindow.setMaximizable(false);
        mainWindow.setMinimumSize(1100, 700);
        mainWindow.setSize(1100, 700);
        mainWindow.center();
    }
});
