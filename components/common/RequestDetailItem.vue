<template>
  <div class="request-detail-item mb-3">
    <div class="text-subtitle-2 mb-1">
      <v-icon :icon="icon" class="me-2" size="small" />
      {{ label }}
    </div>

    <div class="text-body-2 ms-6">
      <slot name="value">
        {{ value }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string
  icon: string
}

defineProps<Props>()

defineSlots<{
  value?: () => void
}>()
</script>

<style scoped lang="scss">
.request-detail-item {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding-bottom: 0.75rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
}
</style>