// label.ts
export interface LabelPrinterOptions {
  printerName: string;
  templateName: string;
  labelWidth: number;
  labelHeight: number;
  dpi?: 0 | 203 | 300;
  threshold?: number;
  edgeBoost?: number;
  widthMM?: number;
  offsetXMM?: number;
  offsetYMM?: number;
}

export interface LabelTemplateConfig {
  name: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
}

export interface LabelMetadata {
  customerName: string;
  equipmentModel: string;
  phoneNumber: string;
  fault: string;
  receivedDate: string;
  receivedTime?: string;
}
