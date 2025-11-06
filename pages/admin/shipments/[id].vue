<template>
  <AdminShipmentDetailView :shipment-id="shipmentId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const shipmentId = route.params.id as string
</script>
