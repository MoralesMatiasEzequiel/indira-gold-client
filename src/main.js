const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
  // Crea la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 780,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Maximiza la ventana
  mainWindow.maximize();

  // Carga el index.html de la aplicación
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Abre las herramientas de desarrollo
  mainWindow.webContents.openDevTools();
};

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas API solo pueden usarse después de que ocurra este evento.
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
