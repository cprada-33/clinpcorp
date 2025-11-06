<template>
  <div class="services-banner">
    <div class="banner-top">
      <img src="/logo.png" :alt="$t('common.logoAlt')" />
    </div>

    <div class="banner-image">
      <img src="/layout/ship.png" :alt="$t('services.banner.imageAlt')" />
    </div>

    <div
      v-for="service in services"
      :key="service.id"
      :class="`banner-bottom bg-primary ${service.extraClass}`">
      <static-services-service-card
        :title="service.title"
        :image-alt="service.imageAlt"
        :description="service.description"
        :image-src="service.imageSrc"
        :image-position="service.imagePosition" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Service {
  id: number;
  title: string;
  imageAlt: string;
  description: string;
  imageSrc: string;
  imagePosition: "left" | "right";
  extraClass: string;
}

const { t } = useI18n()

const services: Service[] = [
  {
    id: 1,
    title: t('services.multimodal.title'),
    imageAlt: t('services.multimodal.imageAlt'),
    description: t('services.multimodal.detailedDescription'),
    imageSrc: "/layout/service-multimodal.png",
    imagePosition: "left",
    extraClass: "pt-md-10 pt-15",
  },
  {
    id: 2,
    title: t('services.forwarder.title'),
    imageAlt: t('services.forwarder.imageAlt'),
    description: t('services.forwarder.detailedDescription'),
    imageSrc: "/layout/service-forwarder.png",
    imagePosition: "right",
    extraClass: "",
  },
  {
    id: 3,
    title: t('services.chartering.title'),
    imageAlt: t('services.chartering.imageAlt'),
    description: t('services.chartering.detailedDescription'),
    imageSrc: "/layout/service-chartering.png",
    imagePosition: "left",
    extraClass: "",
  },
];
</script>

<style scoped lang="scss">
.services-banner {
  position: relative;
  min-height: 100vh;
}

.banner-top {
  height: 30vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.banner-bottom {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image {
  position: absolute;
  top: 30vh;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    background-color: white;
    border-radius: 50%;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
