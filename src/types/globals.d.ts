declare global {
  interface Window {
    electronApi: {
      getPrinterNames: () => Promise<string[]>;
      saveLabelSettings: (options: LabelPrinterOptions) => Promise<boolean>;
      saveReceiptSettings: (options: ReceiptPrinterOptions) => Promise<boolean>;
      printLabel: (image: string, quantity?: number) => Promise<void>;
      printReceipt: (image: string) => Promise<void>;
      loadLabelSettings: () => Promise<LabelPrinterOptions>;
      loadReceiptSettings: () => Promise<ReceiptPrinterOptions>;
      initializePrinters: () => Promise<void>;
    };
  }
}

export {}; // Important for module augmentation
