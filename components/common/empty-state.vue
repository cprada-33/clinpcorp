<template>
  <div class="empty-state pa-8 text-center">
    <v-icon
      :icon="icon"
      :size="iconSize"
      class="mb-2 text-medium-emphasis"
    />
    <div class="text-body-2 text-medium-emphasis mb-2">{{ message }}</div>
    <div v-if="description" class="text-caption text-medium-emphasis">
      {{ description }}
    </div>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  iconSize?: number | string
  message: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-file-document-outline',
  iconSize: 48
})
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
</style>
