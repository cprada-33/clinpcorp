<template>
  <h1 class="pt-10 pb-6 pl-15 text-secondary">
    {{ $t("home.services.title") }}
  </h1>
  <v-container>
    <v-row>
      <v-col v-for="service in services" :key="service.id" cols="12" md="4">
        <static-home-service-card
          :title="$t(service.titleKey)"
          :description="$t(service.descriptionKey)"
          :logo="service.logo" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <common-btn
          :text="$t('home.services.viewAll')"
          class="bg-secondary"
          :to="$localePath('/services')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const services = [
  {
    id: 1,
    titleKey: "services.multimodal.title",
    descriptionKey: "services.multimodal.description",
    logo: "/layout/service-multimodal.png",
  },
  {
    id: 2,
    titleKey: "services.forwarder.title",
    descriptionKey: "services.forwarder.description",
    logo: "/layout/service-forwarder.png",
  },
  {
    id: 3,
    titleKey: "services.chartering.title",
    descriptionKey: "services.chartering.description",
    logo: "/layout/service-chartering.png",
  },
];
</script>
