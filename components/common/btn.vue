<template>
  <v-btn
    variant="text"
    :active="false"
    :class="props.class"
    :hover="false"
    :prepend-icon="icon">
    {{ props.text }}
  </v-btn>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "bg-primary",
  },
});
</script>

<style scoped>
.btn-no-opacity {
  --v-btn-opacity: 1;
}
</style>
