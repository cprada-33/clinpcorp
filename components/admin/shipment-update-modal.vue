<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-6 bg-primary">
        <v-icon icon="mdi-update" class="me-2" />
        Update Shipment Status
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- Current Status -->
          <v-alert
            v-if="shipment"
            type="info"
            variant="tonal"
            class="mb-4"
            density="compact">
            <div class="text-body-2">
              <strong>Current Status:</strong> {{ getStatusLabel(shipment.status) }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">
              Tracking: {{ shipment.trackingNumber }}
            </div>
          </v-alert>

          <!-- New Status -->
          <v-select
            v-model="formData.status"
            label="New Status *"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            :rules="statusRules"
            variant="outlined"
            prepend-inner-icon="mdi-flag"
            class="mb-4"
            required />

          <!-- Location (for Awaiting Transshipment) -->
          <v-expand-transition>
            <div v-if="formData.status === 'awaiting_transshipment'">
              <v-alert
                type="warning"
                variant="tonal"
                density="compact"
                class="mb-4">
                Transshipment location is required for this status
              </v-alert>

              <v-text-field
                v-model="formData.location.country"
                label="Country *"
                :rules="countryRules"
                variant="outlined"
                prepend-inner-icon="mdi-flag"
                class="mb-4"
                required />

              <v-text-field
                v-model="formData.location.city"
                label="City *"
                :rules="cityRules"
                variant="outlined"
                prepend-inner-icon="mdi-city"
                class="mb-4"
                required />
            </div>
          </v-expand-transition>

          <!-- Notes -->
          <v-textarea
            v-model="formData.notes"
            label="Notes (optional)"
            variant="outlined"
            prepend-inner-icon="mdi-note-text"
            rows="3"
            counter
            maxlength="500"
            placeholder="Add any relevant notes about this update..." />

          <!-- Error Message -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            closable
            @click:close="error = null">
            {{ error }}
          </v-alert>

          <!-- Success Message -->
          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mt-4">
            {{ successMessage }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleCancel"
          :disabled="loading">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!isValid">
          Update Status
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Shipment, ShipmentStatus } from "~/src/types/shipment-admin.types";

interface Props {
  modelValue: boolean;
  shipment: Shipment | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "updated"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { createShipmentUpdate } = useShipment();

const formRef = ref();
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const formData = ref({
  status: "" as ShipmentStatus | "",
  location: {
    country: "",
    city: "",
  },
  notes: "",
});

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const statusOptions = [
  { title: "Awaiting Shipping", value: "awaiting_shipping" },
  { title: "Shipped", value: "shipped" },
  { title: "In Transit", value: "in_transit" },
  { title: "Awaiting Transshipment", value: "awaiting_transshipment" },
  { title: "Transshipped", value: "transshipped" },
  { title: "Delivered", value: "delivered" },
  { title: "On Hold", value: "on_hold" },
  { title: "Cancelled", value: "cancelled" },
];

const statusRules = [
  (v: string) => !!v || "Status is required",
  (v: string) => v !== props.shipment?.status || "Please select a different status",
];

const countryRules = [
  (v: string) =>
    formData.value.status !== "awaiting_transshipment" ||
    !!v ||
    "Country is required for transshipment",
];

const cityRules = [
  (v: string) =>
    formData.value.status !== "awaiting_transshipment" ||
    !!v ||
    "City is required for transshipment",
];

const isValid = computed(() => {
  if (!formData.value.status) return false;
  if (formData.value.status === props.shipment?.status) return false;
  if (
    formData.value.status === "awaiting_transshipment" &&
    (!formData.value.location.country || !formData.value.location.city)
  ) {
    return false;
  }
  return true;
});

const getStatusLabel = (status: string) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option?.title || status;
};

const resetForm = () => {
  formData.value = {
    status: "" as ShipmentStatus | "",
    location: {
      country: "",
      city: "",
    },
    notes: "",
  };
  error.value = null;
  successMessage.value = null;
};

const handleCancel = () => {
  if (!loading.value) {
    resetForm();
    dialog.value = false;
  }
};

const handleSubmit = async () => {
  if (!props.shipment || !formData.value.status) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const updateData: any = {
      shipmentId: props.shipment.id,
      status: formData.value.status,
      notes: formData.value.notes || undefined,
    };

    // Add location only if it's awaiting transshipment
    if (formData.value.status === "awaiting_transshipment") {
      updateData.location = {
        country: formData.value.location.country,
        city: formData.value.location.city,
      };
    }

    const response = await createShipmentUpdate(updateData);

    if (response.success) {
      successMessage.value = "Shipment status updated successfully";

      setTimeout(() => {
        emit("updated");
        resetForm();
        dialog.value = false;
      }, 1500);
    } else {
      error.value = response.message || "Failed to update shipment status";
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "An error occurred while updating shipment";
  } finally {
    loading.value = false;
  }
};

// Reset form when dialog closes
watch(dialog, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});
</script>

<style scoped>
.v-card-title {
  color: white;
}
</style>
