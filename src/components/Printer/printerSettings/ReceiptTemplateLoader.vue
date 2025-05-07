// ReceiptTemplateLoader.vue
<template>
  <component
    :is="CurrentTemplate"
    v-if="CurrentTemplate"
    :settings="props.settings"
    :customer-name="props.customerName"
    :equipment-model="props.equipmentModel"
    :phone-number="props.phoneNumber"
    :fault="props.fault"
    :received-date="props.receivedDate"
    :delivery-date="props.deliveryDate"
  />
  <div v-else class="text-negative">
    Error loading template: {{ printerStore.receiptOptions.templateName }}
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { usePrinterStore } from 'src/stores/printer/printersStore';
import { markRaw } from 'vue';

const props = defineProps({
  settings: Object,
  items: Array,
  total: Number,
  paymentMethod: String,
  date: String,
  deliveryDate: String,
  customerName: String,
  equipmentModel: String,
  fault: String,
  phoneNumber: String,
  receivedDate: String,
  // Add any other props needed by templates
});

onMounted(async () => {
  try {
    console.log(props);
  } catch (e) {
    console.error('Failed to load Props:', e);
  }
});

const printerStore = usePrinterStore();
const isLoading = ref(false);
const loadError = ref<Error | null>(null);

const templateComponents = {
  ServiceReceiptArabic: markRaw(
    defineAsyncComponent(() => import('../ReceiptTemplates/ServiceReceiptArabic.vue')),
  ),
  ServiceReceiptEnglish: markRaw(
    defineAsyncComponent(() => import('../ReceiptTemplates/ServiceReceiptEnglish.vue')),
  ),
};

const CurrentTemplate = ref();

watch(
  () => printerStore.receiptOptions.templateName,
  (newTemplate) => {
    if (!newTemplate) {
      CurrentTemplate.value = null;
      return;
    }

    isLoading.value = true;
    loadError.value = null;

    try {
      CurrentTemplate.value = templateComponents[newTemplate as keyof typeof templateComponents];
    } catch (error) {
      console.error('Template load error:', error);
      loadError.value = error instanceof Error ? error : new Error(String(error));
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true },
);
</script>
