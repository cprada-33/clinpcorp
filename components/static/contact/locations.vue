<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="7" class="d-flex flex-column h-auto">
        <img
          src="/layout/location-blue.png"
          :alt="$t('contact.worldMapAlt')"
          class="w-100 h-100 pl-md-15"
          style="object-fit: contain" />
        <div class="pl-md-15 px-5">
          <h2 class="text-secondary">{{ $t("contact.title") }}</h2>
          <div class="d-flex ga-5">
            <v-icon icon="mdi-phone" />
            <p>{{ $t("contact.phone") }}</p>
          </div>
          <div class="d-flex align-center ga-5 pt-3">
            <v-icon icon="mdi-email" />
            <div>
              <p>{{ $t("contact.email") }}</p>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <h1 class="ma-5 mt-0">{{ $t("contact.offices.title") }}</h1>
        <v-card class="bg-primary px-md-15 py-5 w-md-75 ml-md-15">
          <div class="d-flex py-5 align-center px-7 px-md-0">
            <v-icon icon="mdi-map-marker" class="pr-10" />
            <div>
              <h2 class="text-secondary">
                {{ $t("contact.offices.usa.country") }}
              </h2>
              <p>{{ $t("contact.offices.usa.address") }}</p>
            </div>
          </div>
          <v-divider />
          <div class="d-flex py-5 align-center px-7 px-md-0">
            <v-icon icon="mdi-map-marker" class="pr-10" />
            <div>
              <h2 class="text-secondary">
                {{ $t("contact.offices.panama.country") }}
              </h2>
              <p>{{ $t("contact.offices.panama.address") }}</p>
            </div>
          </div>
          <v-divider />
          <div class="d-flex py-5 align-center px-7 px-md-0">
            <v-icon icon="mdi-map-marker" class="pr-10" />
            <div>
              <h2 class="text-secondary">
                {{ $t("contact.offices.venezuela.country") }}
              </h2>
              <p>{{ $t("contact.offices.venezuela.address") }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
