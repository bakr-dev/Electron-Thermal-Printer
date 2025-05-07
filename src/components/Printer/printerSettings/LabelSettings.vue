<!-- LabelSettings.vue -->
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
        v-model.number="form.widthMM"
        type="number"
        label="Width (mm) use to resize label dimensions on paper"
        outlined
        step="1"
        min="10"
        class="col-6"
      />
    </div>

    <div class="row q-col-gutter-md">
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

    <div class="row q-col-gutter-md">
      <q-input
        v-model.number="form.offsetXMM"
        type="number"
        label="X Offset (mm)"
        outlined
        step="1"
        class="col-6"
      />

      <q-input
        v-model.number="form.offsetYMM"
        type="number"
        label="Y Offset (mm)"
        outlined
        step="1"
        class="col-6"
      />
    </div>

    <!-- Template Selection -->
    <q-select
      v-model="form.templateName"
      :options="store.availableTemplates"
      option-label="name"
      option-value="component"
      label="Label Template"
      outlined
      required
      class="q-mb-md"
      @update:model-value="updateTemplateDimensions"
    />

    <!-- Label Dimensions -->
    <div class="row q-col-gutter-md">
      <q-input
        v-model.number="form.labelWidth"
        type="number"
        label="Width (mm)"
        outlined
        step="1"
        min="10"
        class="col-6"
      />
      <q-input
        v-model.number="form.labelHeight"
        type="number"
        label="Height (mm)"
        outlined
        step="1"
        min="10"
        class="col-6"
      />
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Template Preview</div>
        <div class="q-mt-md row justify-center">
          <div
            :style="{
              // width: `${form.labelWidth + 5}mm`,
              // height: `${form.labelHeight + 5}mm`,
              // border: '1px dashed #666',
              overflow: 'hidden',
            }"
          >
            <LabelTemplateLoader class="preview-container" :settings="form" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-btn type="submit" label="Save Settings" color="primary" class="q-mt-md" />

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-btn
          label="Test Print"
          color="secondary"
          class="full-width"
          @click="handleTestPrint"
          :loading="isTesting"
        />
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrinterStore } from 'src/stores/printer/printersStore';
import LabelTemplateLoader from '../printerSettings/LabelTemplateLoader.vue';
import html2canvas from 'html2canvas';
import type { LabelPrinterOptions, LabelTemplateConfig } from 'src/types/printer';

const store = usePrinterStore();
const isTesting = ref(false);

const form = ref<LabelPrinterOptions>({
  ...store.labelOptions,
  dpi: store.labelOptions.dpi || 0,
  threshold: store.labelOptions.threshold || 180,
  edgeBoost: store.labelOptions.edgeBoost || 0,
  widthMM: store.labelOptions.widthMM || 48,
  offsetXMM: store.labelOptions.offsetXMM || 0,
  offsetYMM: store.labelOptions.offsetYMM || 0,
  labelWidth: store.labelOptions.labelWidth || 52, // Default width
  labelHeight: store.labelOptions.labelHeight || 29, // Default height
});

// customer-name="محمد احمد"
//               equipment-model="iphone 15 pro Max max 2089"
//               phone-number="1234567890"
//               fault="Test Fault شاشة وبطارية"
//               :received-date="testDate"
//               :received-time="testTime"
// const testDate = new Date().toLocaleDateString().split('/').reverse().join('-');
// const testTime = new Date().toLocaleTimeString('en-US', {
//   hour: 'numeric',
//   minute: 'numeric',
//   hour12: true,
// }); // Example: "8:16 AM"

function updateTemplateDimensions(newTemplate: LabelTemplateConfig) {
  form.value.labelWidth = newTemplate.defaultWidth;
  form.value.labelHeight = newTemplate.defaultHeight;
  form.value.templateName = newTemplate.component; // Ensure string value
}

const handleTestPrint = async () => {
  try {
    isTesting.value = true;
    const previewElement = document.querySelector('.preview-container');

    if (!previewElement) throw new Error('Preview element not found');

    const canvas = await html2canvas(previewElement as HTMLElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    await window.electronApi.printLabel(canvas.toDataURL('image/png'), 1);

    // // Create a temporary link element to trigger the download
    // const link = document.createElement('a');
    // link.href = canvas.toDataURL('image/png');
    // link.download = `qrcode-with-details.${'png'}`; // Set the file name
    // document.body.appendChild(link);
    // link.click(); // Trigger the download
    // document.body.removeChild(link); // Clean up

    store.showSuccess('Test print successful!');
  } catch (e) {
    store.handleError(e, 'Test print failed');
  } finally {
    isTesting.value = false;
  }
};

const handleSubmit = () => {
  // Convert to plain object with JSON methods
  const rawData = JSON.parse(JSON.stringify(form.value));
  store.saveLabelSettings(rawData);
};
</script>
