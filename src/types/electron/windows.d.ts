declare global {
  interface Window {
    myWindowAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
    myAPI: {
      printBarcode: () => void;
      onPrintSuccess: () => void;
      onPrintError: () => void;
    };
  }
}

export {};
