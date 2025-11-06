<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <common-login-card
          v-model:credentials="credentials"
          title="Admin Login"
          subtitle="Access to administration panel"
          icon="mdi-shield-account"
          :loading="loading"
          :error-message="loginError"
          :email-errors="errors.email"
          :password-errors="errors.password"
          @submit="handleLogin"
          @forgot-password="showForgotPassword = true" />
      </v-col>
    </v-row>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="400">
      <v-card>
        <v-card-title>Reset Password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="resetEmail"
            label="Email"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            :disabled="resetLoading || resetSuccess" />

          <v-alert v-if="resetError" type="error" variant="tonal" class="mt-4">
            {{ resetError }}
          </v-alert>

          <v-alert
            v-if="resetSuccess"
            type="success"
            variant="tonal"
            class="mt-4">
            Password reset email sent successfully! Check your inbox.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="resetLoading" @click="showForgotPassword = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="resetLoading"
            :disabled="resetSuccess"
            @click="handleResetPassword">
            Send Reset Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const auth = useAuth();
const route = useRoute();

const loading = ref(false);
const loginError = ref("");
const showForgotPassword = ref(false);
const resetEmail = ref("");
const resetLoading = ref(false);
const resetSuccess = ref(false);
const resetError = ref("");

const credentials = ref({
  email: "cprada33+1@hotmail.com",
  password: "Test123456",
});

const errors = ref({
  email: [],
  password: [],
});

// Check if already authenticated and redirect
watch(
  () => auth.user.value,
  async (user) => {
    if (user) {
      // Redirect to original destination or dashboard
      const redirectTo = (route.query.redirect as string) || "/admin/dashboard";
      await navigateTo(redirectTo, { replace: true });
    }
  },
  { immediate: true }
);

const handleLogin = async () => {
  loading.value = true;
  loginError.value = "";

  try {
    await auth.login({
      email: credentials.value.email,
      password: credentials.value.password,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    loginError.value =
      error.message || "Invalid email or password. Please try again.";
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  if (!resetEmail.value) {
    resetError.value = "Please enter your email address";
    return;
  }

  resetLoading.value = true;
  resetError.value = "";
  resetSuccess.value = false;

  try {
    await auth.resetPassword(resetEmail.value);
    resetSuccess.value = true;

    // Close dialog after 2 seconds and reset state
    setTimeout(() => {
      showForgotPassword.value = false;
      resetEmail.value = "";
      resetSuccess.value = false;
    }, 2000);
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    resetError.value =
      error instanceof Error
        ? error.message
        : "Failed to send reset email. Please try again.";
  } finally {
    resetLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.fill-height {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.1) 100%
  );
}
</style>
