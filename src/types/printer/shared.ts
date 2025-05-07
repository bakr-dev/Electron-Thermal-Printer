// shared.ts
export interface ReceiptItem {
  name: string;
  price: number;
}

export interface PrinterDimensions {
  widthMM: number;
  heightMM?: number;
}

export type DPI = 0 | 203 | 300;
