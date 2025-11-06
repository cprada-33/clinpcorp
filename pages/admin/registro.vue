<!-- <template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center py-6">
            <v-icon icon="mdi-account-plus" size="48" color="primary" class="mb-2" />
            <div class="text-h4">Admin Registration</div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Create new admin account
            </div>
          </v-card-title>

          <v-card-text>
            <v-form ref="registerForm" @submit.prevent="register">
              <v-text-field
                v-model="formData.displayName"
                label="Full Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="nameRules"
                required
              />

              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="emailRules"
                :error-messages="errors.email"
                required
              />

              <v-text-field
                v-model="formData.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                :rules="passwordRules"
                :error-messages="errors.password"
                required
              />

              <v-text-field
                v-model="formData.confirmPassword"
                label="Confirm Password"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                :rules="confirmPasswordRules"
                required
              />

              <v-text-field
                v-model="formData.phoneNumber"
                label="Phone Number (optional)"
                type="tel"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                placeholder="+1234567890"
              />

              <v-alert
                v-if="registerError"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ registerError }}
              </v-alert>

              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                prepend-icon="mdi-account-plus"
              >
                Create Account
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn
              variant="text"
              size="small"
              :to="'/admin'"
            >
              Already have an account? Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false,
})

const auth = useAuth()
const router = useRouter()

const registerForm = ref()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const registerError = ref('')
const successMessage = ref('')

const formData = ref({
  email: 'cprada33+1@hotmail.com',
  password: 'Test123456',
  confirmPassword: 'Test123456',
  displayName: 'Carlos Prada Test',
  phoneNumber: '+573001234567'
})

const errors = ref({
  email: [],
  password: []
})

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters'
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
  (v: string) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  (v: string) => /[0-9]/.test(v) || 'Password must contain at least one number'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === formData.value.password || 'Passwords do not match'
]

// Check if already authenticated
watch(() => auth.user, (user) => {
  if (user && user.role === 'admin') {
    router.push('/admin/dashboard')
  }
}, { immediate: true })

const register = async () => {
  const { valid } = await registerForm.value.validate()

  if (!valid) return

  loading.value = true
  registerError.value = ''
  successMessage.value = ''

  try {
    // Register with Firebase
    await auth.register({
      email: formData.value.email,
      password: formData.value.password,
      displayName: formData.value.displayName,
      phoneNumber: formData.value.phoneNumber || undefined
    })

    successMessage.value = 'Account created successfully! Redirecting to dashboard...'

    // Wait a moment to show success message
    setTimeout(async () => {
      await router.push('/admin/dashboard')
    }, 2000)

  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle specific Firebase errors
    if (error.message?.includes('email-already-in-use')) {
      registerError.value = 'This email is already registered'
    } else if (error.message?.includes('weak-password')) {
      registerError.value = 'Password is too weak'
    } else if (error.message?.includes('invalid-email')) {
      registerError.value = 'Invalid email format'
    } else {
      registerError.value = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-secondary), 0.1) 100%);
}
</style> -->

<template>
  <div>p</div>
</template>
