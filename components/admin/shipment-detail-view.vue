<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn
          to="/admin/dashboard"
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4">
          Back to Dashboard
        </v-btn>

        <h1 class="text-h3 mb-2">Shipment Details</h1>
        <p v-if="shipment" class="text-subtitle-1 text-medium-emphasis mb-6">
          Tracking Number: {{ shipment.trackingNumber }}
        </p>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          class="mb-4" />
        <p class="text-h6">Loading shipment details...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-if="error && !loading">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" prominent>
          <v-alert-title>Error Loading Data</v-alert-title>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Content -->
    <v-row v-if="shipment && !loading">
      <v-col cols="12" md="8">
        <!-- Status Timeline -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-timeline" class="me-2" />
            Shipment Timeline
          </v-card-title>

          <v-card-text>
            <v-timeline align="start" density="compact">
              <v-timeline-item
                v-for="(update, index) in shipmentTimeline"
                :key="index"
                :dot-color="getStatusColor(update.status)"
                size="small">
                <div class="mb-4">
                  <div class="font-weight-bold">{{ getStatusLabel(update.status) }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDateTime(update.createdAt) }}
                  </div>
                  <div v-if="update.location" class="text-caption mt-1">
                    <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                    {{ update.location.city }}, {{ update.location.country }}
                  </div>
                  <div v-if="update.notes" class="text-body-2 mt-2">
                    {{ update.notes }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>

        <!-- Company Information -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-domain" class="me-2" />
            Company Information
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Company Name
                  </div>
                  <div class="text-body-1">{{ shipment.companyName }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Email</div>
                  <div class="text-body-1">{{ shipment.companyEmail }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6" v-if="shipment.bookingReference">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Booking Reference
                  </div>
                  <div class="text-body-1">{{ shipment.bookingReference }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Route Information -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-map-marker-path" class="me-2" />
            Route Details
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <div class="text-overline text-primary">Origin</div>
                  <div class="text-h6 mb-1">{{ shipment.origin.port }}</div>
                  <div class="text-body-2">
                    {{ shipment.origin.city }}, {{ shipment.origin.country }}
                  </div>
                  <div
                    v-if="shipment.origin.address"
                    class="text-caption text-medium-emphasis mt-1">
                    {{ shipment.origin.address }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <div class="text-overline text-success">Destination</div>
                  <div class="text-h6 mb-1">
                    {{ shipment.destination.port }}
                  </div>
                  <div class="text-body-2">
                    {{ shipment.destination.city }},
                    {{ shipment.destination.country }}
                  </div>
                  <div
                    v-if="shipment.destination.address"
                    class="text-caption text-medium-emphasis mt-1">
                    {{ shipment.destination.address }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Cargo Information -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-package-variant" class="me-2" />
            Cargo Details
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Commodity</div>
                  <div class="text-body-1">{{ shipment.cargo.commodity }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Container Type
                  </div>
                  <div class="text-body-1">
                    {{ shipment.cargo.containerType }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Number of Containers
                  </div>
                  <div class="text-body-1">
                    {{ shipment.cargo.numberOfContainers }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Weight per Container
                  </div>
                  <div class="text-body-1">
                    {{ shipment.cargo.weightPerContainer }} kg
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Total Weight
                  </div>
                  <div class="text-body-1 font-weight-bold">
                    {{ shipment.cargo.totalWeight }} kg
                  </div>
                </div>
              </v-col>
              <v-col cols="12" v-if="shipment.cargo.description">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Description
                  </div>
                  <div class="text-body-2">
                    {{ shipment.cargo.description }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Vessel Information -->
        <v-card
          class="mb-4"
          v-if="shipment.vesselName || shipment.voyageNumber">
          <v-card-title>
            <v-icon icon="mdi-ship" class="me-2" />
            Vessel Details
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" v-if="shipment.vesselName">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Vessel Name
                  </div>
                  <div class="text-body-1">{{ shipment.vesselName }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6" v-if="shipment.voyageNumber">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Voyage Number
                  </div>
                  <div class="text-body-1">{{ shipment.voyageNumber }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Notes -->
        <v-card class="mb-4" v-if="shipment.notes">
          <v-card-title>
            <v-icon icon="mdi-note-text" class="me-2" />
            Additional Notes
          </v-card-title>

          <v-card-text>
            <div class="text-body-2">{{ shipment.notes }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Status Card -->
        <v-card class="mb-4">
          <v-card-title>Shipment Status</v-card-title>

          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis mb-2">
                Current Status
              </div>
              <v-chip
                :color="getStatusColor(shipment.status)"
                variant="flat"
                class="text-uppercase"
                size="large">
                {{ getStatusLabel(shipment.status) }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">
                Tracking Number
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ shipment.trackingNumber }}
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Created Date</div>
              <div class="text-body-2">
                {{ formatDateTime(shipment.createdAt) }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Last Updated</div>
              <div class="text-body-2">
                {{ formatDateTime(shipment.updatedAt) }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Dates Card -->
        <v-card class="mb-4">
          <v-card-title>Schedule</v-card-title>

          <v-card-text>
            <div class="mb-4" v-if="shipment.estimatedDepartureDate">
              <div class="text-caption text-medium-emphasis">
                Estimated Departure
              </div>
              <div class="text-body-2">
                {{ formatDate(shipment.estimatedDepartureDate) }}
              </div>
            </div>

            <div class="mb-4" v-if="shipment.actualDepartureDate">
              <div class="text-caption text-medium-emphasis">
                Actual Departure
              </div>
              <div class="text-body-2 font-weight-bold">
                {{ formatDate(shipment.actualDepartureDate) }}
              </div>
            </div>

            <div class="mb-4" v-if="shipment.estimatedArrivalDate">
              <div class="text-caption text-medium-emphasis">
                Estimated Arrival
              </div>
              <div class="text-body-2">
                {{ formatDate(shipment.estimatedArrivalDate) }}
              </div>
            </div>

            <div class="mb-4" v-if="shipment.actualArrivalDate">
              <div class="text-caption text-medium-emphasis">
                Actual Arrival
              </div>
              <div class="text-body-2 font-weight-bold">
                {{ formatDate(shipment.actualArrivalDate) }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Actions Card -->
        <v-card>
          <v-card-title>Actions</v-card-title>

          <v-card-text>
            <div class="d-flex flex-column ga-2">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-update"
                @click="openUpdateModal"
                :disabled="shipment.status === 'delivered' || shipment.status === 'cancelled'">
                Update Status
              </v-btn>

              <v-btn
                color="info"
                variant="outlined"
                prepend-icon="mdi-email-send"
                @click="sendUpdate">
                Send Update Email
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Not Found State -->
    <v-row v-if="!shipment && !loading && !error">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-12">
            <v-icon
              icon="mdi-package-variant-remove"
              size="64"
              class="mb-4 text-medium-emphasis" />
            <div class="text-h6 mb-2">Shipment not found</div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              The requested shipment could not be found.
            </div>
            <v-btn to="/admin/dashboard" color="primary">
              Back to Dashboard
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Update Modal -->
    <AdminShipmentUpdateModal
      v-model="showUpdateModal"
      :shipment="shipment"
      @updated="handleStatusUpdated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Props {
  shipmentId: string;
}

const props = defineProps<Props>();

const {
  currentShipment,
  loading,
  error,
  fetchShipmentById,
  shipmentUpdates,
  fetchShipmentUpdates,
} = useShipment();

const shipment = computed(() => currentShipment.value);

const shipmentTimeline = computed(() => {
  // Combine shipment creation with updates
  const timeline = [];

  if (shipment.value) {
    // Add initial creation as first item
    timeline.push({
      status: 'awaiting_shipping',
      createdAt: shipment.value.createdAt,
      notes: 'Shipment created',
    });
  }

  // Add all updates in chronological order (already sorted desc from backend)
  if (shipmentUpdates.value && shipmentUpdates.value.length > 0) {
    timeline.push(...shipmentUpdates.value);
  }

  // Sort by date descending (most recent first)
  return timeline.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    awaiting_shipping: "Awaiting Shipping",
    shipped: "Shipped",
    in_transit: "In Transit",
    awaiting_transshipment: "Awaiting Transshipment",
    transshipped: "Transshipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    on_hold: "On Hold",
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    awaiting_shipping: "info",
    shipped: "cyan",
    in_transit: "primary",
    awaiting_transshipment: "orange",
    transshipped: "purple",
    delivered: "success",
    cancelled: "error",
    on_hold: "warning",
  };
  return colors[status] || "grey";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const showUpdateModal = ref(false);

const sendUpdate = () => {
  // TODO: Implement email update functionality
  console.log("Send update to:", shipment.value?.companyEmail);
};

const openUpdateModal = () => {
  showUpdateModal.value = true;
};

const handleStatusUpdated = async () => {
  // Reload shipment data and updates after status change
  try {
    await Promise.all([
      fetchShipmentById(props.shipmentId),
      fetchShipmentUpdates(props.shipmentId),
    ]);
  } catch (err) {
    console.error("Failed to reload shipment details:", err);
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      fetchShipmentById(props.shipmentId),
      fetchShipmentUpdates(props.shipmentId),
    ]);
  } catch (err) {
    console.error("Failed to load shipment details:", err);
  }
});
</script>
