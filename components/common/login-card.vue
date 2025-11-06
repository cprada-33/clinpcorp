<template>
  <v-card class="elevation-12">
    <v-card-title class="text-center py-6">
      <v-icon
        :icon="icon"
        size="48"
        color="primary"
        class="mb-2" />
      <div class="text-h4">{{ title }}</div>
      <div class="text-subtitle-1 text-medium-emphasis">
        {{ subtitle }}
      </div>
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="localCredentials.email"
          :label="emailLabel"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="emailRules"
          :error-messages="emailErrors"
          required />

        <v-text-field
          v-model="localCredentials.password"
          :label="passwordLabel"
          :type="showPassword ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          :rules="passwordRules"
          :error-messages="passwordErrors"
          required />

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="loading"
          :prepend-icon="submitIcon">
          {{ submitText }}
        </v-btn>
      </v-form>
    </v-card-text>

    <v-card-actions v-if="showForgotPassword" class="justify-center pb-6">
      <v-btn
        variant="text"
        size="small"
        @click="handleForgotPassword">
        {{ forgotPasswordText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface LoginCredentials {
  email: string;
  password: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  icon?: string;
  emailLabel?: string;
  passwordLabel?: string;
  submitText?: string;
  submitIcon?: string;
  forgotPasswordText?: string;
  showForgotPassword?: boolean;
  loading?: boolean;
  errorMessage?: string;
  emailErrors?: string[];
  passwordErrors?: string[];
  credentials?: LoginCredentials;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Login",
  subtitle: "Access to your account",
  icon: "mdi-account-circle",
  emailLabel: "Email",
  passwordLabel: "Password",
  submitText: "Login",
  submitIcon: "mdi-login",
  forgotPasswordText: "Forgot password?",
  showForgotPassword: true,
  loading: false,
  errorMessage: "",
  emailErrors: () => [],
  passwordErrors: () => [],
  credentials: () => ({ email: "", password: "" }),
});

interface Emits {
  (e: "submit", credentials: LoginCredentials): void;
  (e: "forgot-password"): void;
  (e: "update:credentials", credentials: LoginCredentials): void;
}

const emit = defineEmits<Emits>();

const formRef = ref();
const showPassword = ref(false);

const localCredentials = ref<LoginCredentials>({
  email: props.credentials.email,
  password: props.credentials.password,
});

// Watch for external changes to credentials prop
watch(
  () => props.credentials,
  (newCredentials) => {
    localCredentials.value = {
      email: newCredentials.email,
      password: newCredentials.password,
    };
  },
  { deep: true }
);

// Emit changes to parent
watch(
  localCredentials,
  (newCredentials) => {
    emit("update:credentials", newCredentials);
  },
  { deep: true }
);

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) return;

  emit("submit", localCredentials.value);
};

const handleForgotPassword = () => {
  emit("forgot-password");
};

defineExpose({
  validate: () => formRef.value?.validate(),
  reset: () => formRef.value?.reset(),
});
</script>
