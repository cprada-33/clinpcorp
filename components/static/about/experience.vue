<template>
  <section class="diamond-section px-0">
    <v-container>
      <v-row class="align-center min-vh-100">
        <v-col cols="6" class="d-none d-md-flex diamond-column">
          <div class="diamond-container">
            <div class="diamond-border">
              <div class="diamond-image">
                <img src="/layout/banner_one.webp" :alt="$t('about.experience.imageAlt')" />
              </div>
            </div>
          </div>
          <div class="group-text">
            <h3>{{ $t('about.experience.groupName') }}</h3>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="content-column mt-0">
          <div class="content-wrapper">
            <h2 class="main-title text-secondary">{{ $t('about.experience.title') }}</h2>

            <p class="description-text px-10 px-sm-0">
{{ $t('about.experience.paragraph1') }}
            </p>

            <p class="description-text pb-md-0 pb-15 px-10 px-sm-0">
{{ $t('about.experience.paragraph2') }}
            </p>

            <div class="d-flex d-md-none diamond-container">
              <div class="diamond-border">
                <div class="diamond-image">
                  <img src="/layout/banner_one.webp" :alt="$t('about.experience.imageAlt')" />
                </div>
              </div>
            </div>
            <div class="d-flex d-md-none group-text pb-10">
              <h3>{{ $t('about.experience.groupName') }}</h3>
            </div>

            <p class="highlight-text">{{ $t('about.experience.operationsIntro') }}</p>

            <ul class="feature-list px-5">
              <li>{{ $t('about.experience.operations.laura') }}</li>
              <li>{{ $t('about.experience.operations.cygnus') }}</li>
              <li>{{ $t('about.experience.operations.maria') }}</li>
              <li>{{ $t('about.experience.operations.arubaborg') }}</li>
            </ul>

            <p class="closing-text px-10">
              {{ $t('about.experience.conclusion') }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Component logic here if needed
</script>

<style lang="scss" scoped>
.diamond-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.diamond-column {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.diamond-container {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  margin-bottom: 2rem;
}

.diamond-border {
  position: absolute;
  left: -20%;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 80vh;
  height: 80vh;
  border: 3px solid #f77d25;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diamond-image {
  width: 100%;
  height: 100%;
  transform: rotate(-45deg);
  overflow: hidden;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.group-text {
  text-align: center;

  h3 {
    font-size: 1.8rem;
    font-weight: 300;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }
}

.content-column {
  padding-left: 3rem;
}

.content-wrapper {
  max-width: 500px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #5a6c7d;
  margin-bottom: 1.25rem;
}

.highlight-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #34495e;
  font-style: italic;
  margin: 2rem 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;

  li {
    position: relative;
    padding: 0.75rem 0;
    padding-left: 2rem;
    font-size: 1.1rem;
    color: #5a6c7d;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: #ff6b35;
      border-radius: 50%;
    }
  }
}

.closing-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #5a6c7d;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .diamond-section {
    padding: 2rem 0;
  }

  .diamond-container {
    height: 60vh;
  }

  .diamond-border {
    width: 60vh;
    height: 60vh;
    left: -25%;
  }

  .content-column {
    padding-left: 1rem;
    margin-top: 2rem;
  }

  .main-title {
    font-size: 2rem;
  }
}
</style>
