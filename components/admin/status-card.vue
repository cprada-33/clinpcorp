<template>
  <v-card>
    <v-card-title>
      <v-icon :icon="icon" class="me-2" />
      {{ title }}
    </v-card-title>

    <v-divider />

    <v-card-text>
      <div v-for="status in statusBreakdown" :key="status.label" class="mb-3">
        <div class="d-flex align-center justify-space-between mb-1">
          <div class="d-flex align-center">
            <v-chip
              :color="status.color"
              size="x-small"
              variant="flat"
              class="me-2"
            />
            <span class="text-body-2">{{ status.label }}</span>
          </div>
          <span class="text-body-2 font-weight-bold">{{ status.count }}</span>
        </div>
        <v-progress-linear
          :model-value="status.percentage"
          :color="status.color"
          height="6"
          rounded
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface StatusBreakdownItem {
  label: string
  count: number
  percentage: number
  color: string
}

interface Props {
  title: string
  icon: string
  statusBreakdown: StatusBreakdownItem[]
}

defineProps<Props>()
</script>
