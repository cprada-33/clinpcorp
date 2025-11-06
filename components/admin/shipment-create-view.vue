<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h3">Create New Shipment</h1>
            <p class="text-subtitle-1 text-medium-emphasis mt-2">
              Enter the shipment details to create a new tracking entry
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Success Alert -->
    <v-row v-if="successMessage">
      <v-col cols="12">
        <v-alert type="success" variant="tonal" prominent closable @click:close="successMessage = ''">
          <v-alert-title>Shipment Created Successfully!</v-alert-title>
          {{ successMessage }}
          <template v-slot:append>
            <v-btn
              variant="text"
              :to="`/admin/shipments/${currentShipment?.id}`"
              v-if="currentShipment"
            >
              View Shipment
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-row v-if="error && !loading">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" prominent closable @click:close="clearError">
          <v-alert-title>Error Creating Shipment</v-alert-title>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-row>
        <!-- Company Information -->
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-domain" class="me-2" />
              Company Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.companyName"
                    label="Company Name"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.companyEmail"
                    label="Company Email"
                    type="email"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.bookingReference"
                    label="Booking Reference (Optional)"
                    variant="outlined"
                    hint="Reference to existing booking if applicable"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Origin Information -->
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-map-marker" class="me-2" />
              Origin
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.origin.port"
                    label="Port"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.origin.city"
                    label="City"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.origin.country"
                    label="Country"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.origin.address"
                    label="Address (Optional)"
                    variant="outlined"
                    rows="2"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Destination Information -->
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-map-marker-check" class="me-2" />
              Destination
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.destination.port"
                    label="Port"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.destination.city"
                    label="City"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.destination.country"
                    label="Country"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.destination.address"
                    label="Address (Optional)"
                    variant="outlined"
                    rows="2"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Cargo Information -->
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-package-variant" class="me-2" />
              Cargo Details
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.cargo.commodity"
                    label="Commodity"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.cargo.containerType"
                    label="Container Type"
                    :items="containerTypes"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.cargo.numberOfContainers"
                    label="Number of Containers"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positive]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.cargo.weightPerContainer"
                    label="Weight per Container (kg)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positive]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    :model-value="totalWeight"
                    label="Total Weight (kg)"
                    variant="outlined"
                    readonly
                    bg-color="grey-lighten-4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.cargo.description"
                    label="Description (Optional)"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Shipping Details -->
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-ship" class="me-2" />
              Shipping Details
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.vesselName"
                    label="Vessel Name (Optional)"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.voyageNumber"
                    label="Voyage Number (Optional)"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.estimatedDepartureDate"
                    label="Estimated Departure Date"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.estimatedArrivalDate"
                    label="Estimated Arrival Date"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.notes"
                    label="Notes (Optional)"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Action Buttons -->
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <div class="d-flex ga-3 justify-end">
                <v-btn
                  variant="outlined"
                  @click="resetForm"
                  :disabled="loading"
                >
                  Reset
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  prepend-icon="mdi-check"
                >
                  Create Shipment
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CreateShipmentRequest } from '~/src/types/shipment-admin.types'

const { createShipment, loading, error, currentShipment, clearError } = useShipment()

const formRef = ref()
const successMessage = ref('')

const containerTypes = [
  '20\' Standard',
  '40\' Standard',
  '40\' High Cube',
  '20\' Refrigerated',
  '40\' Refrigerated',
  '20\' Open Top',
  '40\' Open Top',
  '20\' Flat Rack',
  '40\' Flat Rack',
]

const formData = ref<CreateShipmentRequest>({
  bookingReference: 'BKG-2025-001234',
  companyName: 'Global Exports Inc.',
  companyEmail: 'logistics@globalexports.com',
  origin: {
    port: 'Port of Shanghai',
    city: 'Shanghai',
    country: 'China',
    address: '1500 Yangshupu Rd, Hongkou District',
  },
  destination: {
    port: 'Port of Los Angeles',
    city: 'Los Angeles',
    country: 'United States',
    address: '425 S Palos Verdes St, San Pedro, CA 90731',
  },
  cargo: {
    commodity: 'Electronics Components',
    containerType: '40\' High Cube',
    numberOfContainers: 3,
    weightPerContainer: 18500,
    totalWeight: 55500,
    description: 'Assorted electronic components including semiconductors, circuit boards, and LED displays. Temperature sensitive items requiring controlled environment.',
  },
  vesselName: 'MSC Gülsün',
  voyageNumber: 'MSC-PA-2025-047',
  estimatedDepartureDate: '2025-11-15',
  estimatedArrivalDate: '2025-12-02',
  notes: 'High priority shipment. Requires customs pre-clearance. Contact logistics coordinator 24h before arrival.',
})

const totalWeight = computed(() => {
  const weight = formData.value.cargo.numberOfContainers * formData.value.cargo.weightPerContainer
  formData.value.cargo.totalWeight = weight
  return weight
})

const rules = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid email address'
  },
  positive: (value: number) => value > 0 || 'Must be greater than 0',
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  try {
    successMessage.value = ''

    const response = await createShipment(formData.value)

    if (response.success && response.data) {
      successMessage.value = `Shipment created with tracking number: ${response.data.trackingNumber}`

      // Redirect to shipment detail page after 1.5 seconds
      setTimeout(() => {
        navigateTo(`/admin/shipments/${response.data!.id}`)
      }, 1500)
    }
  } catch (err) {
    console.error('Failed to create shipment:', err)
  }
}

const resetForm = () => {
  formRef.value?.reset()
  formData.value = {
    bookingReference: '',
    companyName: '',
    companyEmail: '',
    origin: {
      port: '',
      city: '',
      country: '',
      address: '',
    },
    destination: {
      port: '',
      city: '',
      country: '',
      address: '',
    },
    cargo: {
      commodity: '',
      containerType: '',
      numberOfContainers: 1,
      weightPerContainer: 0,
      totalWeight: 0,
      description: '',
    },
    vesselName: '',
    voyageNumber: '',
    estimatedDepartureDate: '',
    estimatedArrivalDate: '',
    notes: '',
  }
  successMessage.value = ''
  clearError()
}
</script>
