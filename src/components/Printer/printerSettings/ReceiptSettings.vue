// ReceiptSettings.vue
<template>
  <q-form @submit="handleSubmit" class="q-gutter-y-md q-pa-md">
    <q-select
      v-model="form.printerName"
      :options="store.availablePrinters"
      label="Printer"
      outlined
      required
      class="q-mb-md"
    />

    <div class="row q-col-gutter-md">
      <q-input
        v-model.number="form.dpi"
        type="number"
        label="DPI"
        outlined
        step="1"
        min="0"
        max="300"
        class="col-6"
      >
        <template #hint> Supported values: 0 (auto), 203, 300 </template>
      </q-input>

      <q-input
        v-model.number="form.threshold"
        type="number"
        label="Binarization Threshold"
        outlined
        step="1"
        min="0"
        max="255"
        class="col-6"
      />
    </div>

    <div class="row q-col-gutter-md">
      <q-input
        v-model.number="form.edgeBoost"
        type="number"
        label="Edge Boost (%)"
        outlined
        step="1"
        min="0"
        max="100"
        class="col-6"
      />
    </div>

    <!-- Add Template Selection -->
    <q-select
      v-model="form.templateName"
      :options="store.availableReceiptTemplates"
      option-label="name"
      option-value="component"
      label="Receipt Template"
      outlined
      required
      map-options
      emit-value
      class="q-mb-md"
    />

    <!-- Add Receipt Width -->
    <q-input
      v-model.number="form.receiptWidth"
      type="number"
      label="Width (mm)"
      outlined
      step="1"
      min="50"
      class="col-6"
    />

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Receipt Preview</div>
        <div class="q-mt-md row justify-center">
          <div class="receipt-preview" :style="{ width: `${form.receiptWidth}mm` }">
            <ReceiptTemplateLoader
              :settings="form"
              :items="testItems"
              :total="testTotal"
              payment-method="Cash"
              :date="testDate"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-btn type="submit" label="Save Settings" color="primary" class="q-mt-md" />

    <!-- Update Test Print Section -->
    <q-card class="q-mt-lg">
      <q-card-section>
        <q-btn
          label="Test Print Receipt"
          color="secondary"
          class="full-width"
          @click="handleTestPrint"
          :loading="isTesting"
        />
      </q-card-section>
    </q-card>
  </q-form>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePrinterStore } from 'src/stores/printer/printersStore';
import ReceiptTemplateLoader from '../printerSettings/ReceiptTemplateLoader.vue';
import html2canvas from 'html2canvas';
import type { ReceiptPrinterOptions } from 'src/types/printer';

const store = usePrinterStore();
const isTesting = ref(false);

const form = ref<ReceiptPrinterOptions>({
  ...store.receiptOptions,
  dpi: store.receiptOptions.dpi || 0,
  threshold: store.receiptOptions.threshold || 180,
  edgeBoost: store.receiptOptions.edgeBoost || 50,
});

// Test data
const testDate = new Date().toLocaleDateString();
const testItems = ref([
  { name: 'Service Fee', price: 50 },
  { name: 'Parts Replacement', price: 120 },
]);
const testTotal = computed(() => testItems.value.reduce((sum, item) => sum + item.price, 0));

const handleTestPrint = async () => {
  try {
    isTesting.value = true;
    const previewElement = document.querySelector('.receipt-preview');

    if (!previewElement) throw new Error('Preview element not found');

    const canvas = await html2canvas(previewElement as HTMLElement, {
      scale: 15,
      useCORS: true,
      backgroundColor: null,
    });

    // // Create a temporary link element to trigger the download
    // const link = document.createElement('a');
    // link.href = canvas.toDataURL('image/png');
    // link.download = `qrcode-with-details.${'png'}`; // Set the file name
    // document.body.appendChild(link);
    // link.click(); // Trigger the download
    // document.body.removeChild(link); // Clean up

    await window.electronApi.printReceipt(canvas.toDataURL('image/png'));
    store.showSuccess('Receipt test print successful!');
  } catch (e) {
    store.handleError(e, 'Receipt test print failed');
  } finally {
    isTesting.value = false;
  }
};

const handleSubmit = () => {
  store.saveReceiptSettings(JSON.parse(JSON.stringify(form.value)));
};
</script>

<!-- <script setup lang="ts">
import { usePrinterStore } from 'src/stores/printer/printersStore';
import { ref, toRaw } from 'vue';
import PrintTestTemplate from '../LabelTemplates/PrintTestTemplate.vue';

const store = usePrinterStore();
const form = ref<ReceiptPrinterOptions>({
  ...store.receiptOptions,
  dpi: store.receiptOptions.dpi || 0,
  threshold: store.receiptOptions.threshold || 180,
  edgeBoost: store.receiptOptions.edgeBoost || 50,
});

const handlePrintTest = async (imageData: string) => {
  try {
    await window.electronApi.printReceipt(imageData);
    store.showSuccess('Test receipt printed successfully!');
  } catch (e) {
    store.handleError(e, 'Test print failed');
  }
};

const handleSubmit = () => {
  store.saveReceiptSettings(toRaw(form.value));
};
</script> -->
