<template>
  <v-card variant="flat" class="user-card" rounded="lg">
    <v-card-text class="pa-3">
      <div class="d-flex align-center mb-3">
        <v-avatar size="40" color="primary" class="mr-3">
          <v-icon size="24" color="white">mdi-account</v-icon>
        </v-avatar>
        <div class="flex-grow-1" style="min-width: 0">
          <div class="text-subtitle-2 font-weight-medium text-truncate">
            {{ userName }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">
            {{ userEmail }}
          </div>
        </div>
      </div>

      <div class="mb-2">
        <common-language-switcher block />
      </div>

      <v-btn
        block
        variant="tonal"
        color="error"
        prepend-icon="mdi-logout"
        size="small"
        @click="handleLogout">
        Logout
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  userName?: string;
  userEmail?: string;
}

withDefaults(defineProps<Props>(), {
  userName: "Not identified",
  userEmail: "email not found",
});

const emit = defineEmits<{
  logout: [];
}>();

const handleLogout = () => {
  emit("logout");
};
</script>

<style scoped>
.user-card {
  transition: all 0.3s ease;
}
</style>
