<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="mb-2">Dashboard</h1>
            <p class="text-medium-emphasis mb-0">
              Overview of shipping quotes and bookings
            </p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="handleRefresh">
            Refresh
          </v-btn>
        </div>
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
        <p class="text-h6">Loading dashboard data...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-if="error && !loading">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" prominent>
          <v-alert-title>Error Loading Data</v-alert-title>
          {{ error }}
          <template v-slot:append>
            <v-btn
              variant="text"
              @click="fetchRecentRequests"
              :loading="loading">
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Dashboard Content -->
    <div v-if="!loading && !error">
      <v-row>
        <v-col
          v-for="card in statsCards"
          :key="card.title"
          cols="12"
          md="6"
          lg="3">
          <AdminStatsCard
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :color="card.color" />
        </v-col>
      </v-row>

      <!-- List Sections -->
      <v-row class="mt-4">
        <v-col cols="12" lg="6">
          <AdminListRequest
            title="Recent Quotes"
            icon="mdi-currency-usd"
            :items="recentQuotes"
            route-prefix="quote"
            avatar-icon="mdi-ship"
            avatar-color="primary"
            empty-icon="mdi-currency-usd"
            empty-message="No quotes yet"
            empty-description="Quotes will appear here when customers submit quote requests"
            :status-labels="quoteStatusLabels"
            :status-colors="quoteStatusColors" />
        </v-col>

        <v-col cols="12" lg="6">
          <AdminListRequest
            title="Recent Bookings"
            icon="mdi-text-box"
            :items="recentBookings"
            route-prefix="booking"
            avatar-icon="mdi-anchor"
            avatar-color="success"
            empty-icon="mdi-text-box"
            empty-message="No bookings yet"
            empty-description="Bookings will appear here when customers submit booking requests"
            :status-labels="bookingStatusLabels"
            :status-colors="bookingStatusColors" />
        </v-col>
      </v-row>

      <!-- Status Section -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <AdminStatusCard
            title="Quotes by Status"
            icon="mdi-chart-donut"
            :status-breakdown="quoteStatusBreakdown" />
        </v-col>

        <v-col cols="12" md="6">
          <AdminStatusCard
            title="Bookings by Status"
            icon="mdi-chart-donut"
            :status-breakdown="bookingStatusBreakdown" />
        </v-col>
      </v-row>
    </div>
    <!-- End Dashboard Content -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { QuoteItem, BookingItem } from "~/src/types/requests.types";
import type { Booking, Quote } from "~/src/types/admin.types";

// Use admin composable to fetch data
const { recentRequests, loading, error, fetchRecentRequests } = useAdmin();

// Transform API data to match existing component structure
const quotes = computed<QuoteItem[]>(() => {
  if (!recentRequests.value) return [];
  return recentRequests.value.quotes.map((quote: Quote) => ({
    ...quote,
    routeFrom: quote.routeFrom,
    routeFromCity: quote.routeFromCity,
    routeTo: quote.routeTo,
    routeToCity: quote.routeToCity,
    commodity: quote.commodity,
    containerType: quote.containerType,
    numberOfContainers: quote.numberOfContainers,
    weightPerContainer: quote.weightPerContainer,
    effectiveDate: quote.effectiveDate,
    expiryDate: quote.expiryDate,
    companyName: quote.companyName,
    country: quote.country,
    companyEmail: quote.companyEmail,
  }));
});

const bookings = computed<BookingItem[]>(() => {
  if (!recentRequests.value) return [];
  return recentRequests.value.bookings.map((booking: Booking) => ({
    ...booking,
    portOfLoading: booking.portOfLoading,
    portOfLoadingCity: booking.portOfLoadingCity,
    portOfDischarge: booking.portOfDischarge,
    portOfDischargeCity: booking.portOfDischargeCity,
    vesselDeparture: booking.vesselDeparture,
    quotationContractNumber: booking.quotationContractNumber,
    commodity: booking.commodity,
    containerType: booking.containerType,
    numberOfContainers: booking.numberOfContainers,
    weightPerContainer: booking.weightPerContainer,
    companyName: booking.companyName,
    country: booking.country,
    companyEmail: booking.companyEmail,
  }));
});

// Fetch data on mount
onMounted(async () => {
  try {
    await fetchRecentRequests();
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
  }
});

// Handle refresh
const handleRefresh = async () => {
  try {
    await fetchRecentRequests();
  } catch (err) {
    console.error("Failed to refresh dashboard data:", err);
  }
};

// Recent items (last 5)
const recentQuotes = computed(() => {
  return quotes.value
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
});

const recentBookings = computed(() => {
  return bookings.value
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
});

// Statistics
const stats = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthQuotes = quotes.value.filter((q) => {
    const date = new Date(q.createdAt);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const thisMonthBookings = bookings.value.filter((b) => {
    const date = new Date(b.createdAt);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const pendingQuotes = quotes.value.filter(
    (q) => q.status === "pending"
  ).length;
  const pendingBookings = bookings.value.filter(
    (b) => b.status === "pending"
  ).length;

  return {
    totalQuotes: quotes.value.length,
    totalBookings: bookings.value.length,
    pendingReview: pendingQuotes + pendingBookings,
    thisMonth: thisMonthQuotes + thisMonthBookings,
  };
});

// Stats cards configuration
const statsCards = computed(() => [
  {
    title: "Total Quotes",
    value: stats.value.totalQuotes,
    icon: "mdi-currency-usd",
    color: "primary",
  },
  {
    title: "Total Bookings",
    value: stats.value.totalBookings,
    icon: "mdi-text-box",
    color: "success",
  },
  {
    title: "Pending Review",
    value: stats.value.pendingReview,
    icon: "mdi-clock-outline",
    color: "warning",
  },
  {
    title: "This Month",
    value: stats.value.thisMonth,
    icon: "mdi-calendar-month",
    color: "info",
  },
]);

// Quote status breakdown
const quoteStatusBreakdown = computed(() => {
  const total = quotes.value.length;
  const statusCounts = {
    pending: quotes.value.filter((q) => q.status === "pending").length,
    reviewed: quotes.value.filter((q) => q.status === "reviewed").length,
    approved: quotes.value.filter((q) => q.status === "approved").length,
    rejected: quotes.value.filter((q) => q.status === "rejected").length,
  };

  return [
    {
      label: "Pending",
      count: statusCounts.pending,
      percentage: total > 0 ? (statusCounts.pending / total) * 100 : 0,
      color: "warning",
    },
    {
      label: "Reviewed",
      count: statusCounts.reviewed,
      percentage: total > 0 ? (statusCounts.reviewed / total) * 100 : 0,
      color: "info",
    },
    {
      label: "Approved",
      count: statusCounts.approved,
      percentage: total > 0 ? (statusCounts.approved / total) * 100 : 0,
      color: "success",
    },
    {
      label: "Rejected",
      count: statusCounts.rejected,
      percentage: total > 0 ? (statusCounts.rejected / total) * 100 : 0,
      color: "error",
    },
  ];
});

// Booking status breakdown
const bookingStatusBreakdown = computed(() => {
  const total = bookings.value.length;
  const statusCounts = {
    pending: bookings.value.filter((b) => b.status === "pending").length,
    confirmed: bookings.value.filter((b) => b.status === "confirmed").length,
    in_progress: bookings.value.filter((b) => b.status === "in_progress")
      .length,
    completed: bookings.value.filter((b) => b.status === "completed").length,
    cancelled: bookings.value.filter((b) => b.status === "cancelled").length,
  };

  return [
    {
      label: "Pending",
      count: statusCounts.pending,
      percentage: total > 0 ? (statusCounts.pending / total) * 100 : 0,
      color: "warning",
    },
    {
      label: "Confirmed",
      count: statusCounts.confirmed,
      percentage: total > 0 ? (statusCounts.confirmed / total) * 100 : 0,
      color: "info",
    },
    {
      label: "In Progress",
      count: statusCounts.in_progress,
      percentage: total > 0 ? (statusCounts.in_progress / total) * 100 : 0,
      color: "primary",
    },
    {
      label: "Completed",
      count: statusCounts.completed,
      percentage: total > 0 ? (statusCounts.completed / total) * 100 : 0,
      color: "success",
    },
    {
      label: "Cancelled",
      count: statusCounts.cancelled,
      percentage: total > 0 ? (statusCounts.cancelled / total) * 100 : 0,
      color: "error",
    },
  ];
});

// Status configuration
const quoteStatusLabels: Record<string, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  approved: "Approved",
  rejected: "Rejected",
};

const quoteStatusColors: Record<string, string> = {
  pending: "warning",
  reviewed: "info",
  approved: "success",
  rejected: "error",
};

const bookingStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const bookingStatusColors: Record<string, string> = {
  pending: "warning",
  confirmed: "info",
  in_progress: "primary",
  completed: "success",
  cancelled: "error",
};
</script>
