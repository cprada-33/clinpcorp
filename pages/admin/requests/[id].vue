<template>
  <AdminRequestDetailView
    :request-id="requestId"
    :request-type="requestType"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const fullId = route.params.id as string

// Parse the ID format: "booking-123" or "quote-456"
const [requestType, requestId] = fullId.split('-')
</script>
