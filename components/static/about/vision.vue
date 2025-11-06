<template>
  <v-container fluid class="px-15 py-10">
    <v-row>
      <v-col>
        <div class="d-flex flex-column align-center">
          <img
            src="/layout/vision-logo.png"
            :alt="$t('about.vision.logoAlt')"
            width="150"
            height="150"
            style="object-fit: contain" />
          <h1 class="text-secondary">{{ $t('about.vision.title') }}</h1>
        </div>
        <p>
          {{ $t('about.vision.description') }}
        </p>
      </v-col>
      <v-col>
        <div class="d-flex flex-column align-center">
          <img
            src="/layout/mission-logo.png"
            :alt="$t('about.mission.logoAlt')"
            width="150"
            height="150"
            style="object-fit: contain" />
          <h1 class="text-secondary">{{ $t('about.mission.title') }}</h1>
        </div>
        <p>
          {{ $t('about.mission.description') }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
