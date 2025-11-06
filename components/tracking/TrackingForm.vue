<template>
  <div>
    <v-card class="elevation-8">
      <v-card-text class="pa-8">
        <v-form ref="trackForm" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="trackingData.trackingId"
            label="Tracking ID"
            placeholder="Enter your tracking ID (e.g., NG123456789)"
            prepend-inner-icon="mdi-barcode-scan"
            variant="outlined"
            :rules="trackingIdRules"
            :error-messages="errors.trackingId"
            class="mb-4"
            required />

          <v-text-field
            v-model="trackingData.bookingReference"
            label="Booking Reference"
            placeholder="Enter your booking reference (e.g., BKG-2025-001234)"
            prepend-inner-icon="mdi-file-document"
            variant="outlined"
            :rules="bookingReferenceRules"
            :error-messages="errors.bookingReference"
            class="mb-6"
            required />

          <v-alert
            v-if="trackingError"
            type="error"
            variant="tonal"
            class="mb-4">
            {{ trackingError }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="loading"
            prepend-icon="mdi-magnify">
            Track Shipment
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      <p class="text-body-2 text-medium-emphasis mb-4">
        Don't have a tracking ID? Contact our team
      </p>

      <v-btn to="/contact" variant="outlined" prepend-icon="mdi-phone">
        Contact Us
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { trackShipment } = useShipment();

const trackForm = ref();
const loading = ref(false);
const trackingError = ref("");

const trackingData = ref({
  trackingId: "",
  bookingReference: "",
});

const errors = ref({
  trackingId: [],
  bookingReference: [],
});

const trackingIdRules = [
  (v: string) => !!v || "Tracking ID is required",
  (v: string) => v.length >= 6 || "Tracking ID must be at least 6 characters",
  (v: string) =>
    /^[A-Z0-9-]+$/.test(v.toUpperCase()) ||
    "Tracking ID must contain only letters, numbers, and hyphens",
];

const bookingReferenceRules = [
  (v: string) => !!v || "Booking reference is required",
  (v: string) => v.length >= 6 || "Booking reference must be at least 6 characters",
];

const handleSubmit = async () => {
  const { valid } = await trackForm.value.validate();

  if (!valid) return;

  loading.value = true;
  trackingError.value = "";

  try {
    const trackingId = trackingData.value.trackingId.toUpperCase();
    const bookingReference = trackingData.value.bookingReference;

    const shipment = await trackShipment(trackingId, bookingReference);

    if (shipment) {
      await navigateTo(
        `/track/${trackingId}?booking=${encodeURIComponent(bookingReference)}`
      );
    } else {
      trackingError.value =
        "Shipment not found or booking reference doesn't match. Please verify your tracking ID and booking reference.";
    }
  } catch (error) {
    trackingError.value =
      "An error occurred while tracking your shipment. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
