MaintenanceIntakePage.vue
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Maintenance Equipment Intake</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-gutter-md">
            <!-- Existing form fields -->
            <q-input
              v-model="form.customerName"
              label="Customer Name"
              outlined
              class="col-12"
              :rules="[required]"
            />

            <q-input
              v-model="form.equipmentModel"
              label="Equipment Model"
              outlined
              class="col-12"
              :rules="[required]"
            />

            <q-input
              v-model="form.fault"
              label="Fault Description"
              outlined
              class="col-12"
              :rules="[required]"
            />

            <q-input
              v-model="form.phoneNumber"
              label="Phone Number"
              outlined
              class="col-12"
              :rules="[required, validatePhone]"
            />

            <q-input
              v-model="form.receivedDate"
              label="Received Date"
              outlined
              class="col-12"
              type="date"
              :rules="[required]"
            />

            <!-- Delivery Date Section -->
            <div class="col-12">
              <q-select
                v-model="form.deliveryOption"
                :options="deliveryOptions"
                label="Delivery Time"
                outlined
                class="q-mb-md"
              />

              <q-input
                v-if="form.deliveryOption === 'custom'"
                v-model="form.deliveryDate"
                label="Custom Delivery Date"
                outlined
                type="date"
                :min="minDeliveryDate"
              />
            </div>

            <div class="col-12 q-mt-md">
              <q-btn
                type="submit"
                label="Save & Print Documents"
                color="primary"
                :loading="loading"
              />
            </div>
          </div>
        </q-form>
        <!-- -9999px -->
        <!-- Hidden label preview -->
        <div style="position: absolute; left: -9999px">
          <div
            :style="{
              width: `${store.labelOptions.labelWidth}mm`,
              height: `${store.labelOptions.labelHeight}mm`,
            }"
          >
            <LabelTemplateLoader
              ref="labelPreview"
              :settings="store.labelOptions"
              :customer-name="form.customerName"
              :equipment-model="form.equipmentModel"
              :phone-number="form.phoneNumber"
              :fault="form.fault"
              :received-date="formattedReceivedDate"
            />
          </div>

          <!-- Receipt Preview -->
          <div :style="{ width: `${store.receiptOptions.receiptWidth}mm` }">
            <ReceiptTemplateLoader
              ref="receiptPreview"
              :settings="store.receiptOptions"
              :customer-name="form.customerName"
              :equipment-model="form.equipmentModel"
              :fault="form.fault"
              :phone-number="form.phoneNumber"
              :received-date="formattedReceivedDate"
              :delivery-date="formattedDeliveryDate"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar';
import { usePrinterStore } from 'src/stores/printer/printersStore';
import html2canvas from 'html2canvas';
import LabelTemplateLoader from 'src/components/Printer/printerSettings/LabelTemplateLoader.vue';
import ReceiptTemplateLoader from 'src/components/Printer/printerSettings/ReceiptTemplateLoader.vue';

const store = usePrinterStore();
const loading = ref(false);
const labelPreview = ref<InstanceType<typeof LabelTemplateLoader> | null>(null);
const receiptPreview = ref<InstanceType<typeof ReceiptTemplateLoader> | null>(null);

// Form data
const form = ref({
  customerName: '',
  equipmentModel: '',
  fault: '',
  phoneNumber: '',
  receivedDate: new Date().toISOString().split('T')[0],
  deliveryOption: '1-hour',
  deliveryDate: '',
});

// Delivery options
const deliveryOptions = [
  { label: '1 Hour', value: '1-hour' },
  { label: '2 Hours', value: '2-hours' },
  { label: '1 Day', value: '1-day' },
  { label: 'Custom Date', value: 'custom' },
];

// Computed properties
const formattedReceivedDate = computed(() =>
  date.formatDate(form.value.receivedDate, 'MMM D, YYYY'),
);

const minDeliveryDate = computed(() => new Date().toISOString().split('T')[0]);

const formattedDeliveryDate = computed(() => {
  if (form.value.deliveryOption === 'custom') {
    return date.formatDate(form.value.deliveryDate, 'MMM D, YYYY - hh:mm A');
  }

  const now = new Date();
  switch (form.value.deliveryOption) {
    case '1-hour':
      return date.formatDate(now.setHours(now.getHours() + 1), 'MMM D, YYYY - hh:mm A');
    case '2-hours':
      return date.formatDate(now.setHours(now.getHours() + 2), 'MMM D, YYYY - hh:mm A');
    case '1-day':
      return date.formatDate(now.setDate(now.getDate() + 1), 'MMM D, YYYY - hh:mm A');
    default:
      return 'To be confirmed';
  }
});

// Receipt items (customize as needed)
// const receiptItems = computed(() => [
//   { name: 'Service Type', price: 0 },
//   { name: 'Urgency Fee', price: 0 },
//   { name: 'Estimated Delivery', price: 0 },
// ]);

// Validation rules (keep existing)
const required = (val: string) => !!val || 'This field is required';
const validatePhone = (val: string) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val) || 'Invalid phone number';

// Form submission handler
const handleSubmit = async () => {
  try {
    loading.value = true;

    if (!store.labelOptions.printerName || !store.receiptOptions.printerName) {
      throw new Error('Please configure both label and receipt printer settings first');
    }

    // Generate label image
    const labelCanvas = await html2canvas(labelPreview.value?.$el as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    // Generate receipt image
    const receiptCanvas = await html2canvas(receiptPreview.value?.$el as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    // Print both documents
    await Promise.all([
      window.electronApi.printLabel(labelCanvas.toDataURL('image/png'), 1),
      window.electronApi.printReceipt(receiptCanvas.toDataURL('image/png')),
    ]);

    store.showSuccess('Documents printed successfully!');

    // Reset form
    form.value = {
      customerName: '',
      equipmentModel: '',
      fault: '',
      phoneNumber: '',
      receivedDate: new Date().toISOString().split('T')[0],
      deliveryOption: '1-hour',
      deliveryDate: '',
    };
  } catch (e) {
    store.handleError(e, 'Failed to print documents');
  } finally {
    loading.value = false;
  }
};
</script>
