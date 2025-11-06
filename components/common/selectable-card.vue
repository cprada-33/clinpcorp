<template>
  <v-card
    :class="['selectable-card', { selected: selected }]"
    :elevation="selected ? 8 : 2"
    hover
    @click="$emit('click')">
    <v-card-text class="text-center pa-6">
      <v-icon
        :icon="icon"
        :color="selected ? 'white' : 'black'"
        size="48"
        class="mb-4" />

      <p class="mb-2" :class="selected ? 'text-white' : 'text-black'">
        {{ title }}
      </p>

      <p :class="selected ? 'text-white' : 'text-black'">
        {{ description }}
      </p>
    </v-card-text>

    <v-overlay
      v-if="selected"
      contained
      class="d-flex align-center justify-center"
      opacity="0.1">
      <v-icon icon="mdi-check-circle" color="primary" size="24" />
    </v-overlay>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
  selected?: boolean;
}

defineProps<Props>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="scss">
.selectable-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }

  &.selected {
    border-color: rgb(var(--v-theme-secondary));
    background-color: rgba(var(--v-theme-secondary), 0.8);
  }
}
</style>
