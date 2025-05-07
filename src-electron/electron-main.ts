// electron-main.ts
import { app, BrowserWindow } from 'electron';
import { initialize, enable } from '@electron/remote/main/index.js';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; // Import the dirname function
import { setupPrinterHandlers } from './printer/printers';

initialize();

// Needed in case process is undefined under Linux
const platform = process.platform || os.platform();

const currentDir = dirname(fileURLToPath(import.meta.url)); // Use import.meta.url for __dirname equivalent

let mainWindow: BrowserWindow | undefined;

interface AppWithAsarUnpack extends Electron.App {
  asarUnpack?: string[];
}

if (app.isPackaged) {
  (app as AppWithAsarUnpack).asarUnpack = [
    path.join(currentDir, '../src/components/Printer/LabelTemplates'), // Use currentDir
    path.join(currentDir, '../src/components/Printer/ReceiptTemplates'), // Use currentDir
  ];
}

async function createWindow() {
  // Make createWindow async if needed for top-level await
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false, // to be able to import @electron/remote in preload script
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  });

  enable(mainWindow.webContents);

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL);
  } else {
    await mainWindow.loadFile('index.html'); // Use await with file loading
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

setupPrinterHandlers();
