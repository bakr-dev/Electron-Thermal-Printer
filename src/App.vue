<!-- App.vue -->
<template>
  <router-view />
</template>

<script setup lang="ts">
import { usePrinterStore } from 'src/stores/printer/printersStore';
import { onMounted } from 'vue';

const store = usePrinterStore();

onMounted(async () => {
  try {
    await store.loadSettings(); // Just load settings, not initialize printers
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
});
</script>
