// receipt.ts
import type { ReceiptItem } from './shared';

export interface ReceiptPrinterOptions {
  printerName: string;
  templateName: string;
  receiptWidth: number;
  dpi?: 0 | 203 | 300;
  threshold?: number;
  edgeBoost?: number;
}

export interface ReceiptTemplateConfig {
  name: string;
  component: string;
  defaultWidth: number;
}

export interface ReceiptMetadata {
  customerName?: string;
  equipmentModel?: string;
  fault?: string;
  phoneNumber?: string;
  receivedDate: string;
  deliveryDate: string;
  items?: ReceiptItem[];
  total?: number;
  paymentMethod?: string;
}
