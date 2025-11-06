<template>
  <v-card class="stat-card" :color="color" variant="tonal">
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-subtitle-2 text-medium-emphasis mb-1">{{ title }}</div>
          <div class="text-h4 font-weight-bold">{{ value }}</div>
        </div>
        <v-icon :icon="icon" size="48" class="stat-icon" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon: string
  color: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.stat-card {
  height: 100%;
}

.stat-icon {
  opacity: 0.5;
}
</style>
