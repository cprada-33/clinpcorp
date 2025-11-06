<template>
  <div class="banner-container">
    <div class="image-overlay" />
    <common-carousel :images="images" height="100vh" />
    <div class="banner-content">
      <h1 class="banner-title">{{ $t("home.banner.title") }}</h1>
      <h2 class="banner-subtitle">
        {{ $t("home.banner.subtitle") }}
      </h2>
      <!-- <common-btn :text="$t('home.banner.cta')" class="banner-cta" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
const images = [
  "/layout/banner_one.webp",
  "/layout/banner_two.jpg",
  "/layout/banner_three.webp",
  "/layout/banner_four.webp",
];
</script>

<style scoped>
.banner-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 5;
  pointer-events: none;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.banner-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  animation: fadeIn 1s ease-in;
}

.banner-subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 400;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeIn 1.2s ease-in;
}

.banner-cta {
  margin-top: 1rem;
  animation: fadeIn 1.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .banner-content {
    padding: 0 1rem;
  }

  .banner-title {
    margin-bottom: 0.5rem;
  }

  .banner-subtitle {
    margin-bottom: 1.5rem;
  }
}
</style>
