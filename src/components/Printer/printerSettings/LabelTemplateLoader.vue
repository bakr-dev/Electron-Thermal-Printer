// LabelTemplateLoader.vue
<template>
  <component
    :is="CurrentTemplate"
    v-if="CurrentTemplate"
    :settings="props.settings"
    :customer-name="props.customerName"
    :equipment-model="props.equipmentModel"
    :phone-number="props.phoneNumber"
    :fault="fault"
    :received-date="props.receivedDate"
    :received-time="props.receivedTime"
  />
  <div v-else class="text-negative">
    Error loading template: {{ printerStore.labelOptions.templateName }}
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch } from 'vue';
import { usePrinterStore } from 'src/stores/printer/printersStore';

const props = defineProps({
  settings: Object,
  customerName: String,
  equipmentModel: String,
  phoneNumber: String,
  fault: String,
  receivedDate: String,
  receivedTime: String,
});

const printerStore = usePrinterStore();
const isLoading = ref(false);
const loadError = ref<Error | null>(null);

// Static template map for production compatibility
const templateComponents = {
  MaintenanceLabelArabic: markRaw(
    defineAsyncComponent(() => import('../LabelTemplates/MaintenanceLabelArabic.vue')),
  ),
  MaintenanceLabelEnglish: markRaw(
    defineAsyncComponent(() => import('../LabelTemplates/MaintenanceLabelEnglish.vue')),
  ),
  // SimpleLabel: defineAsyncComponent(() =>
  //   import('../LabelTemplates/SimpleLabel.vue')),
  // FancyLabel: defineAsyncComponent(() =>
  //   import('../LabelTemplates/FancyLabel.vue'))
};

const CurrentTemplate = ref();

watch(
  () => printerStore.labelOptions.templateName,
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
