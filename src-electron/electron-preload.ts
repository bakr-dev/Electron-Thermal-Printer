/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

// electron-preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import { BrowserWindow } from '@electron/remote';
import type { LabelPrinterOptions, ReceiptPrinterOptions } from 'abu-printer';

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow()!.minimize();
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow();

    if (win!.isMaximized()) {
      win!.unmaximize();
    } else {
      win!.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow()!.close();
  },
});

contextBridge.exposeInMainWorld('electronApi', {
  getPrinterNames: () => ipcRenderer.invoke('get-printer-names'),
  initializePrinters: () => ipcRenderer.invoke('initialize-printers'),
  saveLabelSettings: (options: LabelPrinterOptions) =>
    ipcRenderer.invoke('save-label-settings', options),
  saveReceiptSettings: (options: ReceiptPrinterOptions) =>
    ipcRenderer.invoke('save-receipt-settings', options),
  printLabel: (image: string, quantity?: number) =>
    ipcRenderer.invoke('print-label', image, quantity),
  printReceipt: (image: string) => ipcRenderer.invoke('print-receipt', image),
  loadLabelSettings: () => ipcRenderer.invoke('load-label-settings'),
  loadReceiptSettings: () => ipcRenderer.invoke('load-receipt-settings'),
});
