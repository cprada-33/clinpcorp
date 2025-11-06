<template>
  <v-card class="service-card" elevation="4">
    <div class="card-content">
      <div class="white-section" />
      <div class="logo-container">
        <v-avatar size="80" class="logo-avatar">
          <v-img :src="logo" :alt="title" />
        </v-avatar>
      </div>
      <div class="primary-section">
        <div class="content-wrapper">
          <h3 class="card-title">{{ title }}</h3>
          <p class="card-description">{{ description }}</p>
          <v-btn
            v-if="showButton"
            :to="buttonLink"
            variant="outlined"
            color="white"
            class="action-button">
            {{ buttonText }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  logo: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

withDefaults(defineProps<Props>(), {
  showButton: false,
  buttonText: () => useI18n().t("common.seeMore"),
  buttonLink: "#",
});
</script>

<style scoped lang="scss">
.service-card {
  height: 320px;
  position: relative;
  overflow: hidden;
  border-radius: 16px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;

    .logo-avatar {
      transform: scale(1.1);
    }
  }
}

.card-content {
  height: 100%;
  position: relative;
}

.white-section {
  height: 20%;
  background-color: white;
}

.primary-section {
  height: 80%;
  background-color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.logo-container {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.logo-avatar {
  background-color: white;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.content-wrapper {
  text-align: center;
  color: white;
  margin-top: 40px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  opacity: 0.9;
}

.action-button {
  border-color: white !important;
  color: white !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 768px) {
  .logo-avatar {
    width: 60px !important;
    height: 60px !important;
  }

  .card-title {
    font-size: 1.3rem;
  }

  .card-description {
    font-size: 0.9rem;
  }
}
</style>
