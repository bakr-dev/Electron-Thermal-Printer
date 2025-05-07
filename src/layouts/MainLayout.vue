<template>
  <q-layout view="hHh lpr lFf">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <q-icon name="laptop_chromebook" />
        <div>Google Chrome</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>

      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Pirfix App </q-toolbar-title>

        <div>Made By Abubakr</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="250" :breakpoint="767">
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'src/components/Nav/NavLink.vue';

declare global {
  interface Window {
    myWindowAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
    electronAPI: {
      printTspl: (dataUrl: string, quantity: number) => Promise<boolean>;
      print: () => void;
      printBarcode: (imageDataUrl: string) => void;
      onPrintSuccess: () => void;
      onPrintError: () => void;
    };
  }
}

// Listen

function minimize() {
  window.myWindowAPI?.minimize();
}
function toggleMaximize() {
  window.myWindowAPI?.toggleMaximize();
}

function closeApp() {
  window.myWindowAPI?.close();
}

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    // caption: 'quasar.dev',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Printers Settings',
    // caption: 'quasar.dev',
    icon: 'settings',
    link: '/settings',
  },
  {
    title: 'Maintenance registration',
    // caption: 'quasar.dev',
    icon: 'add_task',
    link: '/maintenance',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
