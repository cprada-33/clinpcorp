<template>
  <v-container class="py-8">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <v-btn
          to="/track"
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4">
          Back to Track Search
        </v-btn>

        <h1 v-if="shipment" class="text-h3 mb-2">Track Your Shipment</h1>
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
        <p class="text-h6">Loading shipment information...</p>
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
                v-for="(statusItem, index) in statusTimeline"
                :key="index"
                :dot-color="statusItem.completed ? 'success' : 'grey'"
                size="small">
                <div class="mb-4">
                  <div class="font-weight-bold">{{ statusItem.label }}</div>
                  <div v-if="statusItem.date" class="text-caption text-medium-emphasis">
                    {{ formatDateTime(statusItem.date) }}
                  </div>
                  <div v-if="statusItem.location" class="text-caption mt-1">
                    <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                    {{ statusItem.location }}
                  </div>
                  <div v-if="statusItem.notes" class="text-body-2 mt-2 pa-2 bg-grey-lighten-4 rounded">
                    {{ statusItem.notes }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
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
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Number of Containers
                  </div>
                  <div class="text-body-1">
                    {{ shipment.cargo.numberOfContainers }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Total Weight
                  </div>
                  <div class="text-body-1 font-weight-bold">
                    {{ shipment.cargo.totalWeight }} kg
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
      </v-col>

      <v-col cols="12" md="4">
        <!-- Status Card -->
        <v-card class="mb-4">
          <v-card-title>Current Status</v-card-title>

          <v-card-text>
            <div class="mb-4 text-center">
              <v-chip
                :color="getStatusColor(shipment.status)"
                variant="flat"
                class="text-uppercase"
                size="x-large"
                prepend-icon="mdi-circle-medium">
                {{ getStatusLabel(shipment.status) }}
              </v-chip>
            </div>

            <v-divider class="my-4" />

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">
                Tracking Number
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ shipment.trackingNumber }}
              </div>
            </div>

            <div class="mb-4" v-if="shipment.bookingReference">
              <div class="text-caption text-medium-emphasis">
                Booking Reference
              </div>
              <div class="text-body-1">
                {{ shipment.bookingReference }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Created Date</div>
              <div class="text-body-2">
                {{ formatDate(shipment.createdAt) }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Schedule Card -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-calendar-clock" class="me-2" />
            Schedule
          </v-card-title>

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
              <div class="text-body-2 font-weight-bold text-success">
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
              <div class="text-body-2 font-weight-bold text-success">
                {{ formatDate(shipment.actualArrivalDate) }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Help Card -->
        <v-card color="primary" variant="tonal">
          <v-card-title>Need Help?</v-card-title>

          <v-card-text>
            <p class="text-body-2 mb-4">
              If you have any questions about your shipment, please contact our support team.
            </p>
            <v-btn
              to="/contact"
              color="primary"
              variant="flat"
              block
              prepend-icon="mdi-phone">
              Contact Support
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delivered Status Banner -->
    <v-row class="mt-4" v-if="shipment && shipment.status === 'delivered'">
      <v-col cols="12">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center py-8">
            <v-icon icon="mdi-check-circle" size="64" class="mb-3" />
            <div class="text-h5 mb-2">Shipment Delivered Successfully!</div>
            <div class="text-body-1" v-if="shipment.actualArrivalDate">
              Your shipment was delivered on {{ formatDate(shipment.actualArrivalDate) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Not Found State -->
    <v-row v-if="!shipment && !loading">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-12">
            <v-icon
              icon="mdi-package-variant-remove"
              size="64"
              color="error"
              class="mb-4" />
            <div class="text-h5 mb-2">Shipment Not Found</div>
            <div class="text-body-1 text-medium-emphasis mb-4">
              The tracking number you provided could not be found or the booking
              reference doesn't match our records.
            </div>
            <v-btn to="/track" color="primary" prepend-icon="mdi-magnify">
              Search Again
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const route = useRoute();
const trackingNumber = route.params.id as string;
const bookingReference = route.query.booking as string;

const {
  trackShipment,
  currentShipment,
  shipmentUpdates,
  trackShipmentUpdates,
  loading,
} = useShipment();

const shipment = computed(() => currentShipment.value);

const statusTimeline = computed(() => {
  if (!shipment.value) {
    console.log('Timeline: No shipment data');
    return [];
  }

  console.log('Building timeline. Shipment:', shipment.value);
  console.log('Shipment updates:', shipmentUpdates.value);

  const timeline = [];

  // Add shipment creation
  timeline.push({
    label: 'Shipment Created',
    completed: true,
    date: shipment.value.createdAt,
    location: `${shipment.value.origin.city}, ${shipment.value.origin.country}`,
  });

  // Add all updates from the updates collection
  if (shipmentUpdates.value && shipmentUpdates.value.length > 0) {
    console.log(`Adding ${shipmentUpdates.value.length} updates to timeline`);
    shipmentUpdates.value.forEach((update) => {
      timeline.push({
        label: getStatusLabel(update.status),
        completed: true,
        date: update.createdAt,
        location: update.location
          ? `${update.location.city}, ${update.location.country}`
          : undefined,
        notes: update.notes,
      });
    });
  } else {
    console.log('No updates found');
  }

  // Sort by date descending (most recent first)
  const sorted = timeline.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  console.log('Final timeline:', sorted);
  return sorted;
});

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

const loadShipment = async () => {
  try {
    console.log('Loading shipment...', { trackingNumber, bookingReference });

    // Load shipment data first
    const shipmentResult = await trackShipment(trackingNumber, bookingReference);
    console.log('Shipment loaded:', shipmentResult);

    // Then load updates
    try {
      const updatesResult = await trackShipmentUpdates(trackingNumber, bookingReference);
      console.log('Updates loaded:', updatesResult);
    } catch (updateError) {
      console.error('Error loading updates (continuing anyway):', updateError);
      // Don't fail the whole page if updates fail
    }
  } catch (error) {
    console.error("Error loading shipment:", error);
  }
};

onMounted(() => {
  if (!bookingReference) {
    navigateTo("/track");
    return;
  }

  loadShipment();
});

useSeoMeta({
  title: `Track Shipment ${trackingNumber} - Nogal`,
  description: `Track your shipment ${trackingNumber} and get real-time updates on your package delivery.`,
});
</script>
