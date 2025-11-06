<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn
          to="/admin/requests"
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4">
          Back to Requests
        </v-btn>

        <h1 class="text-h3 mb-2">Request Details</h1>
        <p v-if="request" class="text-subtitle-1 text-medium-emphasis mb-6">
          {{ requestType === "booking" ? "Booking" : "Quote" }} Request #{{
            requestId
          }}
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
        <p class="text-h6">Loading request details...</p>
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
    <v-row v-if="request && !loading">
      <v-col cols="12" md="8">
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
                  <div class="text-body-1">{{ request.companyName }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Email</div>
                  <div class="text-body-1">{{ request.companyEmail }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Country</div>
                  <div class="text-body-1">{{ request.country }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Booking Details -->
        <v-card v-if="requestType === 'booking'" class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-anchor" class="me-2" />
            Booking Details
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Port of Loading
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.portOfLoading }} -
                    {{ bookingData?.portOfLoadingCity }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Port of Discharge
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.portOfDischarge }} -
                    {{ bookingData?.portOfDischargeCity }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Vessel Departure
                  </div>
                  <div class="text-body-1">
                    {{ formatDate(bookingData?.vesselDeparture || "") }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Quotation/Contract Number
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.quotationContractNumber }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Commodity</div>
                  <div class="text-body-1">{{ bookingData?.commodity }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Container Type
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.containerType }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Number of Containers
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.numberOfContainers }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Weight per Container
                  </div>
                  <div class="text-body-1">
                    {{ bookingData?.weightPerContainer }} kg
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Quote Details -->
        <v-card v-if="requestType === 'quote'" class="mb-4">
          <v-card-title>
            <v-icon icon="mdi-currency-usd" class="me-2" />
            Quote Details
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Route From
                  </div>
                  <div class="text-body-1">
                    {{ quoteData?.routeFrom }} - {{ quoteData?.routeFromCity }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Route To</div>
                  <div class="text-body-1">
                    {{ quoteData?.routeTo }} - {{ quoteData?.routeToCity }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Effective Date
                  </div>
                  <div class="text-body-1">
                    {{ formatDate(quoteData?.effectiveDate || "") }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Expiry Date
                  </div>
                  <div class="text-body-1">
                    {{ formatDate(quoteData?.expiryDate || "") }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">Commodity</div>
                  <div class="text-body-1">{{ quoteData?.commodity }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Container Type
                  </div>
                  <div class="text-body-1">{{ quoteData?.containerType }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Number of Containers
                  </div>
                  <div class="text-body-1">
                    {{ quoteData?.numberOfContainers }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis">
                    Weight per Container
                  </div>
                  <div class="text-body-1">
                    {{ quoteData?.weightPerContainer }} kg
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Status Card -->
        <v-card class="mb-4">
          <v-card-title>Request Status</v-card-title>

          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis mb-2">
                Current Status
              </div>
              <v-chip
                :color="getStatusColor(request.status)"
                variant="flat"
                class="text-uppercase">
                {{ getStatusLabel(request.status) }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Created Date</div>
              <div class="text-body-1">
                {{ formatDateTime(request.createdAt) }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Last Updated</div>
              <div class="text-body-1">
                {{ formatDateTime(request.updatedAt) }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Request Type</div>
              <v-chip
                :color="requestType === 'booking' ? 'success' : 'primary'"
                variant="flat"
                size="small">
                {{ requestType === "booking" ? "Booking" : "Quote" }}
              </v-chip>
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
                prepend-icon="mdi-email-send"
                @click="sendResponse">
                Send Response
              </v-btn>

              <v-btn
                v-if="requestType === 'booking'"
                color="success"
                variant="outlined"
                prepend-icon="mdi-check"
                @click="updateStatus('completed')"
                :disabled="request.status === 'completed'">
                Mark as Completed
              </v-btn>

              <v-btn
                v-if="requestType === 'booking'"
                color="orange"
                variant="outlined"
                prepend-icon="mdi-progress-clock"
                @click="updateStatus('in_progress')"
                :disabled="request.status === 'in_progress'">
                Mark as In Progress
              </v-btn>

              <v-btn
                v-if="requestType === 'quote'"
                color="success"
                variant="outlined"
                prepend-icon="mdi-check-circle"
                @click="updateStatus('approved')"
                :disabled="request.status === 'approved'">
                Approve Quote
              </v-btn>

              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-close"
                @click="
                  updateStatus(
                    requestType === 'booking' ? 'cancelled' : 'rejected'
                  )
                ">
                {{ requestType === "booking" ? "Cancel" : "Reject" }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Not Found State -->
    <v-row v-if="!request && !loading && !error">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-12">
            <v-icon
              icon="mdi-file-document-remove"
              size="64"
              class="mb-4 text-medium-emphasis" />
            <div class="text-h6 mb-2">Request not found</div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              The requested item could not be found.
            </div>
            <v-btn to="/admin/requests" color="primary">
              Back to Requests
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { Booking, Quote } from "~/src/types/admin.types";

interface Props {
  requestId: string;
  requestType: string;
}

const props = defineProps<Props>();

const { bookings, quotes, loading, error, fetchBookings, fetchQuotes } =
  useAdmin();

const request = computed(() => {
  if (props.requestType === "booking") {
    return bookings.value.find((b) => b.id === props.requestId);
  } else if (props.requestType === "quote") {
    return quotes.value.find((q) => q.id === props.requestId);
  }
  return null;
});

const bookingData = computed(() => {
  return props.requestType === "booking" ? (request.value as Booking) : null;
});

const quoteData = computed(() => {
  return props.requestType === "quote" ? (request.value as Quote) : null;
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    reviewed: "Reviewed",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "warning",
    confirmed: "info",
    in_progress: "primary",
    completed: "success",
    cancelled: "error",
    reviewed: "info",
    approved: "success",
    rejected: "error",
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

const sendResponse = () => {
  // TODO: Implement email response functionality
  console.log("Send response to:", request.value?.companyEmail);
};

const updateStatus = (newStatus: string) => {
  // TODO: Implement status update functionality
  console.log(
    "Update status to:",
    newStatus,
    "for",
    props.requestType,
    props.requestId
  );
};

onMounted(async () => {
  // Fetch the appropriate data based on request type
  try {
    if (props.requestType === "booking") {
      await fetchBookings();
    } else if (props.requestType === "quote") {
      await fetchQuotes();
    }
  } catch (err) {
    console.error("Failed to load request details:", err);
  }
});
</script>
