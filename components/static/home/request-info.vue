<template>
  <v-container fluid class="bg-primary">
    <v-row>
      <v-col cols="12" class="text-center">
        <h2 class="banner-title my-8">REQUEST INFO</h2>
      </v-col>
    </v-row>

    <v-row class="mx-15">
      <v-col v-for="option in options" :key="option.id" cols="12" md="6">
        <common-selectable-card
          :title="option.title"
          :description="option.description"
          :icon="option.icon"
          :selected="selectedOption === option.id"
          @click="selectOption(option.id)" />
      </v-col>
    </v-row>

    <Transition name="form-slide">
      <v-row v-if="selectedOption">
        <v-col cols="12">
          <div ref="formContainer" class="form-container text-black">
            <h2 class="form-title mb-6">{{ getSelectedOptionTitle() }}</h2>
            <forms-shipping-quote v-if="selectedOption === 'quote'" />
            <forms-booking v-else-if="selectedOption === 'booking'" />
          </div>
        </v-col>
      </v-row>
    </Transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

interface Option {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const selectedOption = ref<string>("");
const formContainer = ref<HTMLElement | null>(null);

const options: Option[] = [
  {
    id: "quote",
    title: "Quote",
    description: "Request a detailed quote for your ship",
    icon: "mdi-currency-usd",
  },
  {
    id: "booking",
    title: "Booking",
    description: "Request your booking document",
    icon: "mdi-text-box",
  },
];

const selectOption = (optionId: string) => {
  selectedOption.value = selectedOption.value === optionId ? "" : optionId;
};

const getSelectedOptionTitle = () => {
  const option = options.find((opt) => opt.id === selectedOption.value);
  return option ? option.title : "";
};

watch(selectedOption, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (formContainer.value) {
        const offset = 100;
        const elementPosition = formContainer.value.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
});
</script>

<style scoped lang="scss">
.form-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: white;
}

.form-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  text-align: center;
  color: rgb(var(--v-theme-primary));
}

.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.form-slide-enter-from,
.form-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.form-slide-enter-to,
.form-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.banner-title {
  font-size: clamp(2rem, 5vw, 4rem);
  margin-bottom: 1rem;
  line-height: 1.2;
}
</style>
