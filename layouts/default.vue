<template>
  <v-app :class="{ 'home-page': isHomePage }">
    <layout-navbar />

    <v-main>
      <slot />
    </v-main>

    <layout-footer />
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const isHomePage = computed(() => {
  const { locale } = useI18n();
  const currentLocale = locale.value;
  return route.name === "index" || route.name === `index___${currentLocale}`;
});

// Provide isHomePage to child components
provide('isHomePage', isHomePage);
</script>
