<template>
  <v-app-bar
    :absolute="isHomePage"
    :app="!isHomePage"
    :class="navbarClasses"
    elevation="0"
    :style="{ zIndex: 1050 }">
    <div class="hidden-sm-and-down d-flex align-center">
      <NuxtLink :to="localePath('/')">
        <v-img src="/logo.png" alt="Logo" width="150" contain class="mr-4" />
      </NuxtLink>
    </div>

    <v-toolbar-items class="hidden-sm-and-down">
      <common-btn
        v-for="item in navigationItems"
        :key="item.title"
        :to="item.to"
        :text="item.title"
        class="mx-2"
        :color="isHomePage ? 'white' : 'primary'"
        :icon="item.icon" />
    </v-toolbar-items>

    <v-spacer />

    <div class="d-flex align-center">
      <common-language-switcher
        class="hidden-sm-and-down mr-2"
        :color="isHomePage ? 'white' : 'primary'" />

      <v-btnx
        :to="localePath('/track')"
        text
        :color="isHomePage ? 'white' : 'primary'"
        class="hidden-sm-and-down mr-4">
        {{ t("navigation.tracking") }}
      </v-btnx>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    width="280"
    :class="drawerClasses"
    :style="{ zIndex: 1060 }">
    <v-list>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :to="item.to"
        @click="drawer = false">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item :to="localePath('/tracking')" @click="drawer = false">
        <v-list-item-title>{{ t("navigation.tracking") }}</v-list-item-title>
      </v-list-item>

      <v-list-item :to="localePath('/login')" @click="drawer = false">
        <v-btn color="primary" variant="elevated" block class="mt-2">
          {{ t("navigation.login") }}
        </v-btn>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item>
        <common-language-switcher />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const drawer = ref(false);

// Inject isHomePage from parent layout
const isHomePage = inject("isHomePage") as ComputedRef<boolean>;

const navbarClasses = computed(() => {
  const baseClasses = "px-4";
  return isHomePage.value
    ? `${baseClasses} navbar-overlay`
    : `${baseClasses} navbar-standard`;
});

const drawerClasses = computed(() => {
  return isHomePage.value ? "drawer-overlay" : "drawer-standard";
});

const { t } = useI18n();
const localePath = useLocalePath();

const navigationItems = computed(() => [
  { title: t("navigation.home"), to: localePath("/"), icon: "mdi-ferry" },
  { title: t("navigation.services"), to: localePath("/services") },
  { title: t("navigation.about"), to: localePath("/about") },
  { title: t("navigation.contact"), to: localePath("/contact") },
]);
</script>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: 500;
}

.navbar-overlay {
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.navbar-overlay .v-toolbar__content {
  background: transparent !important;
}

.navbar-standard {
  background: white;
  transition: all 0.3s ease;
}

.drawer-overlay {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

.drawer-overlay :deep(.v-list-item-title) {
  color: white !important;
}
</style>
