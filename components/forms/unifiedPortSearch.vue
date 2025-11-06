<template>
  <v-autocomplete
    v-model="selectedPort"
    :items="filteredPorts"
    :loading="isSearching"
    :search="searchQuery"
    item-title="label"
    item-value="value"
    :label="label"
    :placeholder="placeholder"
    variant="outlined"
    clearable
    :required="required"
    no-filter
    @update:search="onSearch"
    @update:model-value="onPortSelect">
    <template #prepend-inner>
      <v-icon>mdi-map-marker</v-icon>
    </template>

    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <v-icon size="small">mdi-map-marker-outline</v-icon>
        </template>
        <v-list-item-title>{{ item.raw.city }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.raw.country }}</v-list-item-subtitle>
      </v-list-item>
    </template>

    <template #no-data>
      <v-list-item>
        <v-list-item-title class="text-caption text-medium-emphasis">
          {{
            searchQuery && searchQuery.length < 2
              ? "Type at least 2 characters to search..."
              : "No ports found. Try a different search term."
          }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { PortOption } from "~/src/types/ports.types";

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "port-selected", port: PortOption | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "Search Port",
  placeholder: "e.g., Shanghai, China or Los Angeles, USA",
  required: false,
});

const emit = defineEmits<Emits>();

const { searchPorts } = usePorts();

const selectedPort = ref<string>(props.modelValue || "");
const searchQuery = ref<string>("");
const filteredPorts = ref<PortOption[]>([]);
const isSearching = ref(false);

let searchTimeout: NodeJS.Timeout | null = null;

const onSearch = (query: string | null) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchQuery.value = query || "";

  if (!query || query.length < 2) {
    filteredPorts.value = [];
    return;
  }

  isSearching.value = true;

  searchTimeout = setTimeout(() => {
    filteredPorts.value = searchPorts(query, 50);
    isSearching.value = false;
  }, 300);
};

const onPortSelect = (value: string) => {
  emit("update:modelValue", value);

  const selectedPortData = filteredPorts.value.find((p) => p.value === value);
  emit("port-selected", selectedPortData || null);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== selectedPort.value) {
      selectedPort.value = newValue || "";
    }
  }
);
</script>
