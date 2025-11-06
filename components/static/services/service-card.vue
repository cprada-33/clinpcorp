<template>
  <div class="service-card">
    <v-container>
      <v-row align="center" class="service-card-row px-10">
        <v-col cols="12" md="6" :order="imageOrder" class="image-column">
          <div class="image-container">
            <v-img :src="imageSrc" :alt="imageAlt" class="service-image" />
          </div>
        </v-col>

        <v-col cols="12" md="6" :order="contentOrder" class="content-column">
          <div class="content-wrapper">
            <h2 class="service-title text-secondary">
              {{ title }}
            </h2>
            <p class="service-description text-white">
              {{ description }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: "",
  imagePosition: "left",
});

const imageOrder = computed(() => {
  return props.imagePosition === "left" ? 1 : 2;
});

const contentOrder = computed(() => {
  return props.imagePosition === "left" ? 2 : 1;
});
</script>

<style scoped lang="scss">
.service-card-row {
  min-height: 400px;
}

.image-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
}

.service-image {
  border-radius: 8px;
}

.content-column {
  display: flex;
  align-items: center;
  padding: 2rem;
}

.content-wrapper {
  width: 100%;
}

.service-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  line-height: 1.2;
}

.service-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .service-card-row {
    flex-direction: column !important;
    min-height: auto;
  }

  .image-column,
  .content-column {
    order: unset !important;
  }

  .image-container {
    height: 250px;
  }

  .content-column {
    padding: 1rem;
  }

  .service-title {
    font-size: 1.5rem;
  }

  .service-description {
    font-size: 1rem;
  }
}
</style>
