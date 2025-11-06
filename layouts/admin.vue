<template>
  <v-app>
    <layout-admin-sidebar />

    <v-main class="admin-main-content">
      <v-container fluid class="pa-6 content-container">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Admin layout with sidebar navigation
</script>

<style scoped>
.admin-main-content {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.content-container {
  max-width: 100%;
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .content-container {
    padding: 16px !important;
  }
}

@media (max-width: 600px) {
  .content-container {
    padding: 12px !important;
  }
}
</style>
