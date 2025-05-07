<!-- MaintenanceLabel.vue -->
<template>
  <div ref="labelPreview" class="label-preview" :style="previewStyle">
    <!-- Header Section with Logo -->

    <div class="header-section" :style="headerStyle">
      <qrcode-vue
        :value="value"
        :level="level"
        :size="38"
        :render-as="renderAs"
        :background="background"
        :foreground="foreground"
        :gradient="gradient"
        :gradient-type="gradientType"
        :gradient-start-color="gradientStartColor"
        :gradient-end-color="gradientEndColor"
      />
      <img src="../../../../public//logo/pirfix.png" alt="" :width="75" />
      <div>
        <p class="header-row">{{ props.receivedDate }}</p>
        <p class="header-row">{{ props.receivedTime }}</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="content-section" :style="contentStyle">
      <p class="text-row">العميل: {{ props.customerName }}</p>
      <p class="text-row">الموديل: {{ props.equipmentModel }}</p>
      <p class="text-row">العطل: {{ props.fault }}</p>
      <p class="text-row">رقم الهاتف: {{ props.phoneNumber }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GradientType, Level, RenderAs } from 'qrcode.vue';
import QrcodeVue from 'qrcode.vue';
import type { LabelPrinterOptions } from 'src/types/printer';

// qr values
const value = ref('test');
const level = ref<Level>('M');
const renderAs = ref<RenderAs>('svg');
const background = ref('transparent');
const foreground = ref('#000000');

const gradient = ref(false);
const gradientType = ref<GradientType>('linear');
const gradientStartColor = ref('#000000');
const gradientEndColor = ref('#38bdf8');

const props = defineProps({
  settings: {
    type: Object as () => LabelPrinterOptions,
    required: true,
  },
  customerName: String,
  equipmentModel: String,
  phoneNumber: String,
  fault: String,
  receivedDate: String,
  receivedTime: String,
});

// Computed styles
const previewStyle = computed(() => ({
  width: `${props.settings.labelWidth}mm`,
  height: `${props.settings.labelHeight}mm`,
}));

const headerStyle = computed(() => ({
  height: '40%',
  borderBottom: '1px solid #000',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

const contentStyle = computed(() => ({
  height: '60%',
}));
</script>

<style scoped>
.label-preview {
  border: 1px solid #000;
  border-radius: 2%;
  direction: rtl;
}

.text-row {
  margin: 0;
  margin-right: 3px;
  font-size: 8pt;
  font-family: 'Dubai';
  /* font-weight: lighter; */
}

.header-row {
  margin: 0;
  margin-right: 3px;
  font-size: 7pt;

  font-family: 'Dubai';
  direction: ltr;
}
</style>
