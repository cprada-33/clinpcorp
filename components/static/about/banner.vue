<template>
  <v-container fluid class="px-0 pt-0">
    <v-row class="d-none d-md-flex">
      <v-col cols="6" class="pl-15 bg-primary d-flex align-end">
        <div class="px-15">
          <h1 class="pl-15">{{ $t('about.title') }}</h1>
          <v-divider length="300" thickness="4" class="py-5 ml-15" />
          <p class="px-15 mr-15 pb-15">
            {{ $t('about.description') }}
          </p>
        </div>
      </v-col>
      <v-col cols="6" class="position-relative pa-0" style="height: 90vh">
        <img
          src="/layout/banner_about.jpg"
          alt="containers"
          class="w-100"
          style="object-fit: cover; height: 100%" />
        <div class="values-overlay bg-white text-center pb-15">
          <h1>{{ $t('about.corporateValues.title') }}</h1>
          <div class="text-start">
            <p>1. {{ $t('about.corporateValues.values.operational') }}</p>
            <p>2. {{ $t('about.corporateValues.values.innovation') }}</p>
            <p>3. {{ $t('about.corporateValues.values.integrity') }}</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="d-flex d-md-none">
      <v-col cols="12" class="banner-section">
        <div class="banner-overlay">
          <h1 class="banner-title">{{ $t('about.title') }}</h1>
        </div>
      </v-col>
      <v-col cols="12">
        <p class="px-10 py-5">
          {{ $t('about.mobileDescription') }}
        </p>
      </v-col>
      <v-col cols="5" class="d-flex align-center">
        <h2 class="text-secondary text-center">{{ $t('about.corporateValues.mobileTitle') }}</h2>
      </v-col>
      <v-col cols="7">
        <div class="text-start bg-primary pa-5">
          <p>1. {{ $t('about.corporateValues.values.operational') }}</p>
          <p>2. {{ $t('about.corporateValues.values.innovation') }}</p>
          <p>3. {{ $t('about.corporateValues.values.integrity') }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.values-overlay {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

.banner-section {
  position: relative;
  height: 40vh;
  background-image: url("/layout/banner_about.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}

.banner-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin: 0;
}
</style>
