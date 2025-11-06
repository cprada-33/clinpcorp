<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-icon
        icon="mdi-web"
        v-bind="props"
        variant="text"
        class="text-capitalize"
        prepend-icon="mdi-translate"
        :color="color" />
    </template>
    <v-list>
      <v-list-item
        v-for="locale in availableLocales"
        :key="locale.code"
        :class="{
          'v-list-item--active': locale.code === currentLanguage.code,
        }"
        @click="switchLanguage(locale.code)">
        <v-list-item-title>{{ locale.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface Props {
  color?: string;
}

withDefaults(defineProps<Props>(), {
  color: "primary",
});

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() => locales.value);
const currentLanguage = computed(
  () =>
    availableLocales.value.find((l) => l.code === locale.value) ||
    availableLocales.value[0]
);

const switchLanguage = async (code: string) => {
  await navigateTo(switchLocalePath(code));
};
</script>
