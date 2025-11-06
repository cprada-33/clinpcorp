<template>
  <!-- Mobile App Bar -->
  <v-app-bar v-if="mobile" elevation="1" class="mobile-app-bar">
    <NuxtLink to="/">
      <img
        src="/logo.png"
        alt="Nogal"
        class="ml-2"
        style="max-width: 120px; height: auto" />
    </NuxtLink>

    <v-spacer />

    <v-app-bar-nav-icon @click="drawer = !drawer" />
  </v-app-bar>

  <!-- Sidebar for Desktop, Drawer for Mobile -->
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!mobile"
    :temporary="mobile"
    :rail="rail && !mobile"
    :rail-width="75"
    class="admin-sidebar"
    elevation="1">
    <!-- Logo Section (Desktop only) -->
    <div v-if="!mobile" class="sidebar-header pa-2">
      <div class="d-flex align-center justify-space-between">
        <NuxtLink v-if="!rail" to="/" class="logo-link">
          <img
            src="/logo.png"
            alt="Nogal Logo"
            class="logo-image"
            style="max-width: 160px; height: auto" />
        </NuxtLink>

        <!-- Toggle Rail Button (always visible) -->
        <v-btn
          icon
          variant="text"
          size="small"
          :class="{ 'mx-auto': rail }"
          @click="rail = !rail">
          <v-icon>{{ rail ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider v-if="!mobile" />

    <!-- Navigation Items -->
    <v-list nav class="navigation-list py-4">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        class="mx-2 mb-1"
        active-class="active-nav-item"
        @click="handleNavClick" />

      <v-divider class="my-4 mx-4" />

      <!-- Assign Admin Button -->
      <v-list-item
        prepend-icon="mdi-shield-account"
        title="Assign Admin"
        rounded="lg"
        class="mx-2 mb-1"
        @click="handleAssignAdminClick" />
    </v-list>

    <!-- User Card at Bottom -->
    <template #append>
      <div class="user-section pa-4">
        <common-user-card
          v-if="!rail"
          :user-name="userName"
          :user-email="userEmail"
          @logout="handleLogout" />

        <!-- Compact User Controls when Rail Mode -->
        <div v-else class="d-flex flex-column align-center ga-2">
          <v-tooltip text="User Menu" location="end">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-account"
                size="small"
                variant="text" />
            </template>
          </v-tooltip>

          <v-tooltip text="Logout" location="end">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-logout"
                size="small"
                variant="text"
                color="error"
                @click="handleLogout" />
            </template>
          </v-tooltip>
        </div>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- Assign Admin Modal -->
  <AdminAssignAdminModal
    v-model="showAdminModal"
    @admin-assigned="handleAdminAssigned" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const auth = useAuth();
const showAdminModal = ref(false);
const rail = ref(false);
const drawer = ref(true);

// Responsiveness
const { mobile } = useDisplay();

// Close drawer after navigation on mobile
watch(
  () => drawer.value,
  (newVal) => {
    if (mobile.value && !newVal) {
      // Drawer closed on mobile
    }
  }
);

// User data from auth
const userName = computed(() => {
  return auth.user.value?.displayName || auth.user.value?.email || "Admin User";
});

const userEmail = computed(() => {
  return auth.user.value?.email || "admin@nogal.com";
});

const navigationItems = computed(() => [
  {
    title: "Dashboard",
    to: "/admin/dashboard",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Requests",
    to: "/admin/requests",
    icon: "mdi-file-document-multiple",
  },
  {
    title: "Shipments",
    to: "/admin/shipments",
    icon: "mdi-package-variant",
  },
  {
    title: "Create Shipment",
    to: "/admin/shipments/create",
    icon: "mdi-package-variant-plus",
  },
]);

const handleNavClick = () => {
  if (mobile.value) {
    drawer.value = false;
  }
};

const handleAssignAdminClick = () => {
  showAdminModal.value = true;
  if (mobile.value) {
    drawer.value = false;
  }
};

const handleLogout = async () => {
  await auth.logout();
};

const handleAdminAssigned = (email: string) => {
  console.log(`Admin role assigned to: ${email}`);
};
</script>

<style scoped>
.mobile-app-bar {
  background: white !important;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
}

.admin-sidebar {
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  min-height: 72px;
  display: flex;
  align-items: center;
}

.logo-image {
  transition: all 0.3s ease;
}

.navigation-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.active-nav-item {
  background: rgb(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.active-nav-item :deep(.v-list-item__prepend > .v-icon) {
  color: rgb(var(--v-theme-primary));
}

.user-section {
  border-top: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
}

/* Custom scrollbar for navigation */
.navigation-list::-webkit-scrollbar {
  width: 6px;
}

.navigation-list::-webkit-scrollbar-track {
  background: transparent;
}

.navigation-list::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-on-surface), 0.2);
  border-radius: 3px;
}

.navigation-list::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-on-surface), 0.3);
}
</style>
