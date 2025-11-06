<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h3">Requests Management</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="loadRequests">
            Refresh
          </v-btn>
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
            <v-btn variant="text" @click="loadRequests" :loading="loading">
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
          :items="filteredRequests"
          :loading="loading"
          item-key="id"
          empty-title="No requests found"
          :empty-message="
            filterValues.type || filterValues.status
              ? 'Try adjusting your filters'
              : 'Requests will appear here when customers submit them'
          "
          @row-click="goToDetail">
          <template v-slot:item.type="{ item }">
            <v-chip
              :color="getTypeColor(item.type)"
              variant="flat"
              size="small">
              {{ getTypeLabel(item.type) }}
            </v-chip>
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
            {{ formatRoute(item) }}
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              :to="`/admin/requests/${item.type}-${item.id}`"
              color="primary"
              variant="text"
              size="small"
              icon="mdi-eye" />
          </template>
        </CommonDataTable>
      </v-col>
    </v-row>

    <!-- Load More Button -->
    <v-row v-if="canLoadMore && !loading" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-reload"
          @click="loadMore">
          Load More
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Booking, Quote } from "~/src/types/admin.types";

const {
  bookings,
  quotes,
  loading,
  error,
  fetchBookings,
  fetchQuotes,
  loadMoreBookings,
  loadMoreQuotes,
  bookingsPagination,
  quotesPagination,
} = useAdmin();

const filterValues = ref({
  type: "",
  status: "",
  search: "",
});

const requestTypes = [
  { title: "Bookings", value: "booking" },
  { title: "Quotes", value: "quote" },
];

const statusOptions = [
  // Booking statuses
  { title: "Pending", value: "pending" },
  { title: "Confirmed", value: "confirmed" },
  { title: "In Progress", value: "in_progress" },
  { title: "Completed", value: "completed" },
  { title: "Cancelled", value: "cancelled" },
  // Quote statuses
  { title: "Reviewed", value: "reviewed" },
  { title: "Approved", value: "approved" },
  { title: "Rejected", value: "rejected" },
];

const filterConfigs = [
  {
    key: "type",
    type: "select" as const,
    label: "Request Type",
    items: requestTypes,
    md: 4,
  },
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
    label: "Search by company",
    icon: "mdi-magnify",
    md: 4,
  },
];

interface CombinedRequest {
  id: string;
  companyName: string;
  companyEmail: string;
  type: "booking" | "quote";
  status: string;
  createdAt: string;
  route?: string;
  rawData: Booking | Quote;
}

const allRequests = computed<CombinedRequest[]>(() => {
  const bookingRequests: CombinedRequest[] = bookings.value.map((booking) => ({
    id: booking.id,
    companyName: booking.companyName,
    companyEmail: booking.companyEmail,
    type: "booking" as const,
    status: booking.status,
    createdAt: booking.createdAt,
    route: `${booking.portOfLoadingCity} → ${booking.portOfDischargeCity}`,
    rawData: booking,
  }));

  const quoteRequests: CombinedRequest[] = quotes.value.map((quote) => ({
    id: quote.id,
    companyName: quote.companyName,
    companyEmail: quote.companyEmail,
    type: "quote" as const,
    status: quote.status,
    createdAt: quote.createdAt,
    route: `${quote.routeFromCity} → ${quote.routeToCity}`,
    rawData: quote,
  }));

  return [...bookingRequests, ...quoteRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const filteredRequests = computed(() => {
  return allRequests.value.filter((request) => {
    // Filter by type
    if (filterValues.value.type && request.type !== filterValues.value.type)
      return false;

    // Filter by status
    if (
      filterValues.value.status &&
      request.status !== filterValues.value.status
    )
      return false;

    // Filter by search query
    if (filterValues.value.search) {
      const query = filterValues.value.search.toLowerCase();
      return (
        request.companyName.toLowerCase().includes(query) ||
        request.companyEmail.toLowerCase().includes(query)
      );
    }

    return true;
  });
});

const canLoadMore = computed(() => {
  if (filterValues.value.type === "booking") {
    return bookingsPagination.value?.hasMore || false;
  } else if (filterValues.value.type === "quote") {
    return quotesPagination.value?.hasMore || false;
  }
  return (
    bookingsPagination.value?.hasMore ||
    false ||
    quotesPagination.value?.hasMore ||
    false
  );
});

const headers = [
  { title: "Company", key: "companyName", sortable: true },
  { title: "Email", key: "companyEmail", sortable: true },
  { title: "Route", key: "route", sortable: false },
  { title: "Type", key: "type", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Date", key: "createdAt", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const getTypeLabel = (type: string) => {
  return type === "booking" ? "Booking" : "Quote";
};

const getTypeColor = (type: string) => {
  return type === "booking" ? "success" : "primary";
};

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

const formatRoute = (item: CombinedRequest) => {
  return item.route || "N/A";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const goToDetail = (_event: any, { item }: { item: CombinedRequest }) => {
  navigateTo(`/admin/requests/${item.type}-${item.id}`);
};

const loadRequests = async () => {
  try {
    await Promise.all([fetchBookings(), fetchQuotes()]);
  } catch (err) {
    console.error("Failed to load requests:", err);
  }
};

const applyFilters = async () => {
  if (filterValues.value.type === "booking" && filterValues.value.status) {
    await fetchBookings({ status: filterValues.value.status });
  } else if (filterValues.value.type === "quote" && filterValues.value.status) {
    await fetchQuotes({ status: filterValues.value.status });
  } else if (filterValues.value.type === "booking") {
    await fetchBookings();
  } else if (filterValues.value.type === "quote") {
    await fetchQuotes();
  } else if (filterValues.value.status) {
    // Load both with status filter
    await Promise.all([
      fetchBookings({ status: filterValues.value.status }),
      fetchQuotes({ status: filterValues.value.status }),
    ]);
  } else {
    await loadRequests();
  }
};

const loadMore = async () => {
  if (filterValues.value.type === "booking") {
    await loadMoreBookings();
  } else if (filterValues.value.type === "quote") {
    await loadMoreQuotes();
  } else {
    await Promise.all([loadMoreBookings(), loadMoreQuotes()]);
  }
};

onMounted(async () => {
  await loadRequests();
});
</script>

<style scoped lang="scss">
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}
</style>
