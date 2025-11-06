<template>
  <admin-dashboard-view />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth", "require-admin"],
});
</script>
