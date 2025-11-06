<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon :icon="icon" class="me-2" />
        <span>{{ title }}</span>
      </div>
      <v-btn
        variant="text"
        size="small"
        :to="viewAllLink"
        append-icon="mdi-arrow-right"
      >
        View All
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0">
      <v-list v-if="items.length > 0" lines="two">
        <template v-for="(item, index) in items" :key="item.id">
          <v-list-item
            :to="`${baseRoute}${routePrefix}-${item.id}`"
            class="request-item"
          >
            <template v-slot:prepend>
              <v-avatar :color="avatarColor" variant="tonal">
                <v-icon :icon="avatarIcon" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ item.companyName }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ formatRoute(item) }} • {{ formatDate(item.createdAt) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                {{ getStatusLabel(item.status) }}
              </v-chip>
            </template>
          </v-list-item>

          <v-divider v-if="index < items.length - 1" />
        </template>
      </v-list>

      <CommonEmptyState
        v-else
        :icon="emptyIcon"
        :message="emptyMessage"
        :description="emptyDescription"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { QuoteItem, BookingItem } from '~/src/types/requests.types'

interface Props {
  title: string
  icon: string
  items: QuoteItem[] | BookingItem[]
  routePrefix: 'quote' | 'booking'
  baseRoute?: string
  viewAllLink?: string
  avatarIcon: string
  avatarColor: string
  emptyIcon: string
  emptyMessage: string
  emptyDescription: string
  statusLabels: Record<string, string>
  statusColors: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  baseRoute: '/admin/requests/',
  viewAllLink: '/admin/requests'
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatRoute = (item: QuoteItem | BookingItem) => {
  if ('routeFromCity' in item) {
    return `${item.routeFromCity} → ${item.routeToCity}`
  } else {
    return `${item.portOfLoadingCity} → ${item.portOfDischargeCity}`
  }
}

const getStatusLabel = (status: string) => {
  return props.statusLabels[status] || status
}

const getStatusColor = (status: string) => {
  return props.statusColors[status] || 'grey'
}
</script>

<style scoped lang="scss">
.request-item {
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.05);
  }
}
</style>
