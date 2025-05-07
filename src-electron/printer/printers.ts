// printers.ts
import { ipcMain } from 'electron';
import Printer from 'abu-printer';
import Store from 'electron-store';
import type { LabelPrinterOptions, ReceiptPrinterOptions } from 'src/types/printer';

const store = new Store();
let labelPrinter: InstanceType<typeof Printer.LabelPrinter>;
let receiptPrinter: InstanceType<typeof Printer.ReceiptPrinter>;

export async function initializePrinters() {
  try {
    const labelSettings = store.get('label') as LabelPrinterOptions;
    const receiptSettings = store.get('receipt') as ReceiptPrinterOptions;

    if (labelSettings?.printerName) {
      labelPrinter = new Printer.LabelPrinter(labelSettings);
    }

    if (receiptSettings?.printerName) {
      receiptPrinter = new Printer.ReceiptPrinter(receiptSettings);
    }
  } catch (e) {
    console.error('Printer initialization failed:', e);
  }
}

export function setupPrinterHandlers() {
  initializePrinters(); // Initialize from stored settings
  ipcMain.handle('get-printer-names', handleGetPrinters);
  ipcMain.handle('save-label-settings', handleSaveLabelSettings);
  ipcMain.handle('save-receipt-settings', handleSaveReceiptSettings);
  ipcMain.handle('print-label', handlePrintLabel);
  ipcMain.handle('print-receipt', handlePrintReceipt);
  ipcMain.handle('load-label-settings', handleLoadLabelSettings);
  ipcMain.handle('load-receipt-settings', handleLoadReceiptSettings);
}

async function handleGetPrinters() {
  try {
    return Printer.getAllPrinterNames();
  } catch (e) {
    handleError(e, 'Failed to get printers');
  }
}

// async function handleSaveLabelSettings(_: unknown, settings: LabelPrinterOptions) {
//   try {
//     store.set('label', settings);
//     labelPrinter = new Printer.LabelPrinter(settings);
//     return true;
//   } catch (e) {
//     handleError(e, 'Failed to save label settings');
//   }
// }

// In handleSaveLabelSettings
async function handleSaveLabelSettings(_: unknown, settings: LabelPrinterOptions) {
  try {
    // Ensure templateName is string
    const sanitizedSettings = {
      ...settings,
      templateName: String(settings.templateName),
    };

    store.set('label', sanitizedSettings);
    labelPrinter = new Printer.LabelPrinter(sanitizedSettings);
    return true;
  } catch (e) {
    handleError(e, 'Failed to save label settings');
  }
}

async function handleSaveReceiptSettings(_: unknown, settings: ReceiptPrinterOptions) {
  try {
    const sanitizedSettings = {
      ...settings,
      templateName: String(settings.templateName),
    };

    store.set('receipt', sanitizedSettings);
    receiptPrinter = new Printer.ReceiptPrinter(sanitizedSettings);
    return true;
  } catch (e) {
    handleError(e, 'Failed to save receipt settings');
  }
}

async function handlePrintLabel(_: unknown, imageData: string, quantity: number) {
  try {
    if (!labelPrinter) {
      throw new Error('Label printer not initialized. Please save label settings first.');
    }

    if (!imageData) {
      throw new Error('No image data provided for printing');
    }
    await labelPrinter.print(imageData, quantity);
    return true;
  } catch (e) {
    handleError(e, 'Label print failed');
  }
}

async function handlePrintReceipt(_: unknown, imageData: string) {
  try {
    if (!receiptPrinter) {
      throw new Error('Receipt printer not initialized. Please save receipt settings first.');
    }

    if (!imageData) {
      throw new Error('No image data provided for printing');
    }

    await receiptPrinter.print(imageData);
    return true;
  } catch (e) {
    handleError(e, 'Receipt print failed');
  }
}

// In handleLoadLabelSettings
function handleLoadLabelSettings() {
  const settings = (store.get('label') || {}) as LabelPrinterOptions;
  return {
    ...settings,
    templateName: String(settings.templateName || 'MaintenanceLabelEnglish'),
  };
}

function handleLoadReceiptSettings() {
  const settings = (store.get('receipt') || {}) as ReceiptPrinterOptions;
  return {
    ...settings,
    templateName: String(settings.templateName || 'ServiceReceiptEnglish'),
  };
}
function handleError(e: unknown, context: string) {
  let message = context;

  if (e instanceof Error) {
    message += `\n- ${e.message}`;

    // Add specific troubleshooting tips
    if (e.message.includes('not initialized')) {
      message += '\n- Please verify printer settings are saved';
      message += '\n- Check printer connection';
    }
  }

  throw new Error(message);
}
