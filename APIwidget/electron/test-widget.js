const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 240,
    height: 140,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    roundedCorners: true,
    thickFrame: false,
    focusable: true
  });

  // Make the window draggable
  mainWindow.setMovable(true);

  // Load the test widget
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading test widget in development mode from http://localhost:5174/test-widget.html');
    mainWindow.loadURL('http://localhost:5174/test-widget.html');
  } else {
    const widgetPath = path.join(__dirname, '../dist/test-widget.html');
    console.log('Loading test widget in production mode from', widgetPath);
    mainWindow.loadFile(widgetPath);
  }

  // Open DevTools
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
