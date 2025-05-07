// printerStores.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import type {
  LabelPrinterOptions,
  LabelTemplateConfig,
  ReceiptPrinterOptions,
  ReceiptTemplateConfig,
} from 'src/types/printer';

export const usePrinterStore = defineStore('printers', () => {
  const $q = useQuasar();

  // State
  // State
  const labelOptions = ref<LabelPrinterOptions>({
    printerName: '',
    templateName: 'Maintenance Label English',
    labelWidth: 52,
    labelHeight: 29,
    dpi: 0,
    threshold: 180,
    edgeBoost: 0,
    widthMM: 48,
    offsetXMM: 0,
    offsetYMM: 0,
  });

  const availableTemplates = ref<LabelTemplateConfig[]>([
    {
      name: 'Maintenance Label Arabic',
      component: 'MaintenanceLabelArabic',
      defaultWidth: 52,
      defaultHeight: 29,
    },
    {
      name: 'Maintenance Label English',
      component: 'MaintenanceLabelEnglish',
      defaultWidth: 52,
      defaultHeight: 29,
    },
  ]);

  const receiptOptions = ref<ReceiptPrinterOptions>({
    printerName: '',
    templateName: 'Maintenance Receipt English',
    receiptWidth: 80,
    dpi: 0,
    threshold: 180,
    edgeBoost: 50,
  });

  const availableReceiptTemplates = ref<ReceiptTemplateConfig[]>([
    {
      name: 'Service Receipt English',
      component: 'ServiceReceiptEnglish',
      defaultWidth: 80,
    },
    {
      name: 'Service Receipt Arabic',
      component: 'ServiceReceiptArabic',
      defaultWidth: 80,
    },
  ]);

  const availablePrinters = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const initialize = async () => {
    loading.value = true;
    try {
      availablePrinters.value = await window.electronApi.getPrinterNames();
      labelOptions.value = await window.electronApi.loadLabelSettings();
      receiptOptions.value = await window.electronApi.loadReceiptSettings();
      await window.electronApi.initializePrinters();
    } catch (e) {
      handleError(e, 'Failed to initialize printers');
    } finally {
      loading.value = false;
    }
  };

  const loadSettings = async () => {
    loading.value = true;
    try {
      availablePrinters.value = await window.electronApi.getPrinterNames();
      labelOptions.value = await window.electronApi.loadLabelSettings();
      receiptOptions.value = await window.electronApi.loadReceiptSettings();
    } finally {
      loading.value = false;
    }
  };

  const saveLabelSettings = async (options: LabelPrinterOptions) => {
    loading.value = true;
    try {
      await window.electronApi.saveLabelSettings(options);
      labelOptions.value = options;
      showSuccess('Label settings saved');
      return true;
    } catch (e) {
      handleError(e, 'Failed to save label settings');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const saveReceiptSettings = async (options: ReceiptPrinterOptions) => {
    loading.value = true;
    try {
      await window.electronApi.saveReceiptSettings(options);
      receiptOptions.value = options;
      showSuccess('Receipt settings saved');
      return true;
    } catch (e) {
      handleError(e, 'Failed to save receipt settings');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const handleError = (e: unknown, context: string) => {
    const message = e instanceof Error ? e.message : 'Unknown error';
    $q.notify({
      type: 'negative',
      message: `${context}: ${message}`,
      timeout: 3000,
    });
    error.value = message;
  };

  const showSuccess = (message: string) => {
    $q.notify({
      type: 'positive',
      message,
      timeout: 2000,
    });
  };

  return {
    labelOptions,
    receiptOptions,
    availablePrinters,
    availableTemplates,
    loading,
    error,
    loadSettings,
    initialize,
    saveLabelSettings,
    saveReceiptSettings,
    handleError,
    showSuccess,
    availableReceiptTemplates,
  };
});
