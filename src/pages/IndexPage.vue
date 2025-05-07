<template>
  <q-page class="column items-center justify-center q-gutter-y-xl">
    <div class="column items-center text-center q-px-md">
      <h1 class="text-h4 q-mb-md">
        App made by
        <span class="text-weight-bold text-primary">Abubakr Elzayat</span>
      </h1>

      <p class="text-body1 q-mb-xl" style="max-width: 600px">
        A modern Electron application that handle print Labels & Receipt to thermal printers,
        showcasing clean architecture and efficient state management. Built with Quasar Framework
        and TypeScript for robust cross-platform performance.
      </p>
    </div>

    <div class="row items-center q-gutter-x-xl">
      <a href="https://github.com/bakr-dev/" target="_blank" class="social-link github">
        <q-icon name="fab fa-github" size="2em" />
        <span class="q-ml-sm">GitHub</span>
      </a>

      <a href="https://www.linkedin.com/in/bakr-dev/" target="_blank" class="social-link linkedin">
        <q-icon name="fab fa-linkedin" size="2em" />
        <span class="q-ml-sm">LinkedIn</span>
      </a>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// No script needed unless adding functionality
</script>

<style lang="scss" scoped>
.social-link {
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.2em;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &.github {
    color: #ffffff;
    background-color: #181717;
    &:hover {
      background-color: darken(#181717, 5%);
    }
  }

  &.linkedin {
    color: #ffffff;
    background-color: #0a66c2;
    &:hover {
      background-color: darken(#0a66c2, 5%);
    }
  }
}

.text-primary {
  color: #1976d2; // Quasar's primary color
}

h1 {
  line-height: 1.2;
}
</style>
