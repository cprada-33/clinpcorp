<template>
  <v-carousel
    :hide-delimiters="props.delimeters"
    :show-arrows="props.arrows"
    :model-value="currentSlide"
    :interval="autoPlayDelay"
    :height="props.height"
    :cycle="autoPlay"
    hide-delimiter-background
    @update:model-value="currentSlide = $event">
    <v-carousel-item
      v-for="(image, index) in props.images"
      v-if="props.images.length > 0"
      :key="index"
      :src="image"
      cover />

    <!-- Custom content mode with slots -->
    <slot v-else />
  </v-carousel>
</template>

<script lang="ts" setup>
interface Props {
  autoPlay?: boolean;
  autoPlayDelay?: number;
  height?: string | number;
  delimeters?: boolean;
  arrows?: boolean;
  images?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: true,
  autoPlayDelay: 3000,
  height: 500,
  delimeters: true,
  arrows: false,
  images: () => [],
});

const currentSlide = ref(0);
</script>
