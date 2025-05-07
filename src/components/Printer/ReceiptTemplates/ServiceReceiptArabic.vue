<!-- ServiceReceipt.vue -->
<template>
  <div class="service-receipt" :style="previewStyle">
    <div class="header-section">
      <div>
        <p>إيصال إستلام صيانة</p>
        <!-- <p class="header-row">{{ props.receivedDate }}</p> -->
        <!-- <p class="header-row">{{ props.receivedDate }}</p> -->
        <!-- <p class="header-row">{{ props.receivedTime }}</p> -->
      </div>
      <img src="../../../../public//logo/pirfix.png" alt="" :width="100" />
      <!-- <p class="header-row">{{ props.receivedDate }}</p> -->
      <p style="font-weight: bold">{{ storeTitle }}</p>
    </div>

    <div class="customer-info">
      <p><strong>إسم العميل:</strong> {{ props.customerName }}</p>
      <p><strong>نوع الموبايل:</strong> {{ props.equipmentModel }}</p>
      <p><strong>العطل:</strong> {{ props.fault }}</p>
      <p><strong>رقم التواصل:</strong> {{ props.phoneNumber }}</p>
    </div>

    <div class="delivery-info">
      <!-- <h6>تفاصيل الإستلام</h6> -->
      <p><strong>تاريخ الإستلام:</strong> {{ receivedDate }}</p>
      <p><strong>تاريخ التسليم:</strong> {{ deliveryDate }}</p>
    </div>

    <div class="footer-section">
      <qrcode-vue :value="qrData" :size="80" level="M" />
      <p class="terms">Terms: {{ terms }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import type { ReceiptPrinterOptions } from 'src/types/printer';
// import type { ReceiptPrinterOptions } from 'src/stores/printer-';

const props = defineProps({
  settings: {
    type: Object as () => ReceiptPrinterOptions,
    required: true,
  },
  customerName: String,
  equipmentModel: String,
  fault: String,
  phoneNumber: String,
  receivedDate: String,
  deliveryDate: String,
});

const storeTitle = 'لإصلاح وتغيير شاشات الهواتف';
const terms = 'Warranty valid for 30 days from delivery date';

const previewStyle = computed(() => ({
  width: `${props.settings.receiptWidth}mm`,
  padding: '10px',
  backgroundColor: 'white',
}));

const qrData = computed(() =>
  JSON.stringify({
    customer: props.customerName,
    equipment: props.equipmentModel,
    fault: props.fault,
    delivery: props.deliveryDate,
  }),
);
</script>

<style scoped>
.service-receipt {
  direction: rtl;
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}

.header-section {
  display: 'flex';
  justify-content: 'space-around';
  align-items: 'center';
  text-align: center;
  border-bottom: 2px solid #000;
  /* margin-bottom: 15px; */
}

.customer-info p {
  margin: 8px 0;
}

.delivery-info {
  /* margin: 20px 0; */
  /* padding: 15px; */
  background: #f5f5f5;
  border-radius: 5px;
}

.footer-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #000;
}

p {
  font-size: 10pt;
}

.terms {
  font-size: 9pt;
  color: #666;
  margin-top: 10px;
}
</style>
