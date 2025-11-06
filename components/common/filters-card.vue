<template>
  <v-card>
    <v-card-title>
      <span>Filters</span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col
          v-for="filter in filters"
          :key="filter.key"
          :cols="filter.cols || 12"
          :md="filter.md || 4"
        >
          <v-select
            v-if="filter.type === 'select'"
            :model-value="modelValue[filter.key]"
            :items="filter.items"
            :label="filter.label"
            :clearable="filter.clearable !== false"
            variant="outlined"
            density="compact"
            @update:model-value="(value) => updateFilter(filter.key, value)"
          />

          <v-text-field
            v-else-if="filter.type === 'text'"
            :model-value="modelValue[filter.key]"
            :label="filter.label"
            :prepend-inner-icon="filter.icon"
            :clearable="filter.clearable !== false"
            variant="outlined"
            density="compact"
            @update:model-value="(value) => updateFilter(filter.key, value)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface FilterConfig {
  key: string;
  type: 'select' | 'text';
  label: string;
  items?: Array<{ title: string; value: string }>;
  icon?: string;
  clearable?: boolean;
  cols?: number;
  md?: number;
}

interface Props {
  filters: FilterConfig[];
  modelValue: Record<string, any>;
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'apply'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updateFilter = (key: string, value: any) => {
  const updated = {
    ...props.modelValue,
    [key]: value,
  };
  emit('update:modelValue', updated);
  emit('apply');
};
</script>
