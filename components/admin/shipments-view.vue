<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h3">Shipments Management</h1>
          <div class="d-flex ga-2">
            <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              :loading="loading"
              @click="loadShipments">
              Refresh
            </v-btn>
            <v-btn
              to="/admin/shipments/create"
              color="success"
              prepend-icon="mdi-plus">
              Create Shipment
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-if="error && !loading">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" prominent>
          <v-alert-title>Error Loading Data</v-alert-title>
          {{ error }}
          <template v-slot:append>
            <v-btn variant="text" @click="loadShipments" :loading="loading">
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CommonFiltersCard
          v-model="filterValues"
          :filters="filterConfigs"
          @apply="applyFilters" />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <CommonDataTable
          :headers="headers"
          :items="filteredShipments"
          :loading="loading"
          item-key="id"
          empty-title="No shipments found"
          :empty-message="
            filterValues.status || filterValues.search
              ? 'Try adjusting your filters'
              : 'Shipments will appear here when created'
          "
          @row-click="goToDetail">
          <template v-slot:item.trackingNumber="{ item }">
            <div class="font-weight-bold">{{ item.trackingNumber }}</div>
            <div v-if="item.bookingReference" class="text-caption text-medium-emphasis">
              {{ item.bookingReference }}
            </div>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="flat"
              size="small">
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.route="{ item }">
            <div class="text-body-2">
              {{ item.origin.city }}, {{ item.origin.country }}
            </div>
            <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
            <div class="text-body-2">
              {{ item.destination.city }}, {{ item.destination.country }}
            </div>
          </template>

          <template v-slot:item.cargo="{ item }">
            <div class="text-body-2">{{ item.cargo.commodity }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.cargo.numberOfContainers }}x {{ item.cargo.containerType }}
            </div>
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.estimatedArrival="{ item }">
            <div v-if="item.actualArrivalDate" class="text-success font-weight-bold">
              {{ formatDate(item.actualArrivalDate) }}
            </div>
            <div v-else-if="item.estimatedArrivalDate" class="text-medium-emphasis">
              {{ formatDate(item.estimatedArrivalDate) }}
            </div>
            <div v-else class="text-caption">-</div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              :to="`/admin/shipments/${item.id}`"
              color="primary"
              variant="text"
              size="small"
              icon="mdi-eye" />
          </template>
        </CommonDataTable>
      </v-col>
    </v-row>

    <!-- Statistics Summary -->
    <v-row class="mt-6" v-if="shipments.length > 0">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Total Shipments</div>
            <div class="text-h4 font-weight-bold">{{ shipments.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">In Transit</div>
            <div class="text-h4 font-weight-bold text-primary">
              {{ getStatusCount('in_transit') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Delivered</div>
            <div class="text-h4 font-weight-bold text-success">
              {{ getStatusCount('delivered') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis">Awaiting Shipping</div>
            <div class="text-h4 font-weight-bold text-info">
              {{ getStatusCount('awaiting_shipping') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Shipment } from "~/src/types/shipment-admin.types";

const {
  shipments,
  loading,
  error,
  fetchShipments,
} = useShipment();

const filterValues = ref({
  status: "",
  search: "",
});

const statusOptions = [
  { title: "Awaiting Shipping", value: "awaiting_shipping" },
  { title: "Shipped", value: "shipped" },
  { title: "In Transit", value: "in_transit" },
  { title: "Awaiting Transshipment", value: "awaiting_transshipment" },
  { title: "Transshipped", value: "transshipped" },
  { title: "Delivered", value: "delivered" },
  { title: "Cancelled", value: "cancelled" },
  { title: "On Hold", value: "on_hold" },
];

const filterConfigs = [
  {
    key: "status",
    type: "select" as const,
    label: "Status",
    items: statusOptions,
    md: 4,
  },
  {
    key: "search",
    type: "text" as const,
    label: "Search by tracking, company, or booking ref",
    icon: "mdi-magnify",
    md: 8,
  },
];

const filteredShipments = computed(() => {
  return shipments.value.filter((shipment) => {
    // Filter by status
    if (filterValues.value.status && shipment.status !== filterValues.value.status)
      return false;

    // Filter by search query
    if (filterValues.value.search) {
      const query = filterValues.value.search.toLowerCase();
      return (
        shipment.trackingNumber.toLowerCase().includes(query) ||
        shipment.companyName.toLowerCase().includes(query) ||
        shipment.companyEmail.toLowerCase().includes(query) ||
        (shipment.bookingReference && shipment.bookingReference.toLowerCase().includes(query))
      );
    }

    return true;
  });
});

const headers = [
  { title: "Tracking Number", key: "trackingNumber", sortable: true },
  { title: "Company", key: "companyName", sortable: true },
  { title: "Route", key: "route", sortable: false },
  { title: "Cargo", key: "cargo", sortable: false },
  { title: "Status", key: "status", sortable: true },
  { title: "Created", key: "createdAt", sortable: true },
  { title: "Est. Arrival", key: "estimatedArrival", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

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

const getStatusCount = (status: string) => {
  return shipments.value.filter(s => s.status === status).length;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const goToDetail = (_event: any, { item }: { item: Shipment }) => {
  navigateTo(`/admin/shipments/${item.id}`);
};

const loadShipments = async () => {
  try {
    await fetchShipments();
  } catch (err) {
    console.error("Failed to load shipments:", err);
  }
};

const applyFilters = async () => {
  // Filters are applied through computed property
  // In a real implementation, you might want to fetch from backend with filters
  await loadShipments();
};

onMounted(async () => {
  await loadShipments();
});
</script>

<style scoped lang="scss">
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}
</style>
