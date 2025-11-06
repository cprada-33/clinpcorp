<template>
  <v-timeline side="end" align="start">
    <v-timeline-item
      v-for="(event, index) in events"
      :key="event.id"
      :dot-color="
        event.completed ? getStatusColor(event.status) : 'grey-lighten-1'
      "
      size="small">
      <template v-slot:icon>
        <v-icon
          :icon="getStatusIcon(event.status)"
          :color="event.completed ? 'white' : 'grey-darken-1'"
          size="18" />
      </template>

      <template v-slot:opposite>
        <div class="text-caption text-medium-emphasis">
          {{ event.timestamp ? formatDateTime(event.timestamp) : "Pending" }}
        </div>
      </template>

      <v-card
        :class="[
          'timeline-card',
          { completed: event.completed, current: isCurrent(index) },
        ]"
        :color="event.completed ? 'transparent' : 'grey-lighten-5'"
        variant="outlined">
        <v-card-text>
          <div class="d-flex align-center mb-1">
            <v-chip
              :color="getStatusColor(event.status)"
              :variant="event.completed ? 'flat' : 'outlined'"
              size="small"
              class="me-2">
              {{ getStatusLabel(event.status) }}
            </v-chip>

            <v-icon
              v-if="event.completed"
              icon="mdi-check-circle"
              color="success"
              size="16" />
          </div>

          <div class="text-body-2 font-weight-medium mb-1">
            {{ event.description }}
          </div>

          <div class="text-caption text-medium-emphasis">
            <v-icon icon="mdi-map-marker" size="14" class="me-1" />
            {{ event.location }}
          </div>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface Props {
  events: TrackingEvent[];
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    created: "blue",
    picked_up: "orange",
    in_transit: "purple",
    out_for_delivery: "amber",
    delivered: "green",
    exception: "red",
  };
  return colors[status] || "grey";
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    created: "mdi-package-variant",
    picked_up: "mdi-truck",
    in_transit: "mdi-airplane",
    out_for_delivery: "mdi-truck-delivery",
    delivered: "mdi-check",
    exception: "mdi-alert",
  };
  return icons[status] || "mdi-circle";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    created: "Created",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    exception: "Exception",
  };
  return labels[status] || status;
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isCurrent = (index: number) => {
  return (
    index > 0 &&
    !props.events[index].completed &&
    props.events[index - 1].completed
  );
};

const props = defineProps<Props>();
</script>

<style scoped lang="scss">
.timeline-card {
  transition: all 0.3s ease;

  &.current {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  &.completed {
    opacity: 0.9;
  }
}
</style>
