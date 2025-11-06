<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div>
          <v-icon class="mr-2">mdi-shield-account</v-icon>
          Assign Admin Role
        </div>
        <v-btn icon variant="text" size="small" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.email"
            label="User Email Address"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            :rules="emailRules"
            :error-messages="emailError"
            required
            hint="Email of the user to grant admin access"
            class="mb-2" />

          <v-text-field
            v-model="formData.secretKey"
            label="Secret Key"
            :type="showSecretKey ? 'text' : 'password'"
            prepend-inner-icon="mdi-key"
            :append-inner-icon="showSecretKey ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showSecretKey = !showSecretKey"
            variant="outlined"
            :rules="secretKeyRules"
            :error-messages="secretKeyError"
            required
            hint="Authorization secret key to assign admin role"
            class="mb-2" />

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4">
            {{ successMessage }}
          </v-alert>

          <v-alert type="warning" variant="tonal" density="compact" class="mb-2">
            <div class="text-caption">
              <strong>Warning:</strong> This will grant full admin privileges to
              the specified user account.
            </div>
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog" :disabled="loading">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="handleSubmit"
          prepend-icon="mdi-shield-check">
          Assign Admin Role
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getErrorMessage } from "~/src/utils/error-handler";
import { getFirebaseFunctionUrl, isDevelopmentMode } from "~/src/utils/firebase-functions";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "admin-assigned", email: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<Emits>();

const dialog = ref(props.modelValue);
const formRef = ref();
const showSecretKey = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const emailError = ref("");
const secretKeyError = ref("");

const formData = ref({
  email: "",
  secretKey: "",
});

watch(
  () => props.modelValue,
  (newValue) => {
    dialog.value = newValue;
    if (newValue) {
      resetForm();
    }
  }
);

watch(dialog, (newValue) => {
  emit("update:modelValue", newValue);
});

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const secretKeyRules = [(v: string) => !!v || "Secret key is required"];

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  emailError.value = "";
  secretKeyError.value = "";

  try {
    const isDev = isDevelopmentMode();
    const endpoint = getFirebaseFunctionUrl("assignAdminRole", isDev);

    const response = await $fetch<{ success: boolean; message: string }>(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.value.email,
          secretKey: formData.value.secretKey,
        }),
      }
    );

    if (response.success) {
      successMessage.value = `Admin role assigned to ${formData.value.email} successfully! The user must log out and log back in for changes to take effect.`;
      emit("admin-assigned", formData.value.email);

      // Close dialog after 4 seconds to allow reading the message
      setTimeout(() => {
        closeDialog();
      }, 4000);
    } else {
      errorMessage.value = response.message || "Failed to assign admin role";
    }
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(
      error,
      "Failed to assign admin role. Please check your credentials and try again."
    );
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    email: "",
    secretKey: "",
  };
  errorMessage.value = "";
  successMessage.value = "";
  emailError.value = "";
  secretKeyError.value = "";
  showSecretKey.value = false;
  formRef.value?.resetValidation();
};
</script>
