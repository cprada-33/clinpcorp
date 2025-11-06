<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <!-- Route Section -->
      <v-row>
        <v-col cols="12">
          <h3>Route Information</h3>
        </v-col>
        <v-col cols="12" md="6">
          <FormsUnifiedPortSearch
            v-model="formData.routeFrom"
            label="From (Port/City)"
            placeholder="e.g., Shanghai, China"
            required
            @port-selected="onFromPortSelected" />
        </v-col>
        <v-col cols="12" md="6">
          <FormsUnifiedPortSearch
            v-model="formData.routeTo"
            label="To (Port/City)"
            placeholder="e.g., Los Angeles, USA"
            required
            @port-selected="onToPortSelected" />
        </v-col>
      </v-row>

      <!-- Commodity Section -->
      <v-row>
        <v-col cols="12">
          <h3>Commodity</h3>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="formData.commodity"
            :items="commodityOptions"
            label="Select Commodity"
            variant="outlined"
            required />
        </v-col>
      </v-row>

      <!-- Container Section -->
      <v-row>
        <v-col cols="12">
          <h3>Container Details</h3>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="formData.containerType"
            :items="containerOptions"
            label="Container Type and Size"
            variant="outlined"
            required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="formData.numberOfContainers"
            label="Number of Containers"
            type="number"
            variant="outlined"
            required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="formData.weightPerContainer"
            label="Weight per Container (kg)"
            type="number"
            variant="outlined"
            required />
        </v-col>
      </v-row>

      <!-- Dates Section -->
      <v-row>
        <v-col cols="12">
          <h3>Dates</h3>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.effectiveDate"
            label="Effective Date"
            type="date"
            variant="outlined"
            :min="today"
            required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.expiryDate"
            label="Expiry Date"
            type="date"
            variant="outlined"
            required />
        </v-col>
      </v-row>

      <!-- Company Details Section -->
      <v-row>
        <v-col cols="12">
          <h3>Company Details</h3>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.companyName"
            label="Company Name"
            variant="outlined"
            required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.country"
            label="Country"
            variant="outlined"
            required />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.companyEmail"
            label="Company Email"
            type="email"
            variant="outlined"
            required />
        </v-col>
      </v-row>

      <!-- Submit Message -->
      <v-row v-if="submitMessage">
        <v-col cols="12">
          <v-alert
            :type="submitSuccess ? 'success' : 'error'"
            :text="submitMessage"
            variant="tonal"
            closable
            @click:close="submitMessage = ''" />
        </v-col>
      </v-row>

      <!-- Submit Button -->
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :disabled="!valid || isSubmitting"
            :loading="isSubmitting">
            {{ isSubmitting ? "Submitting..." : "Submit Quote Request" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { QuoteForm } from "@/src/types";
import type { PortOption } from "~/src/types/ports.types";
import commoditiesData from "~/src/constants/commodities.json";
import containersData from "~/src/constants/containers.json";

const { submitShippingQuote, loading, error, successMessage } = useRequests();

const formRef = ref();
const valid = ref(false);
const isSubmitting = computed(() => loading.value);
const submitMessage = computed(() => error.value || successMessage.value || "");
const submitSuccess = computed(() => !!successMessage.value);

const commodityOptions = commoditiesData;
const containerOptions = containersData;

// Get today's date in YYYY-MM-DD format for min date validation
const today = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});

const formData = reactive<QuoteForm>({
  routeFrom: "",
  routeTo: "",
  commodity: "",
  containerType: "",
  numberOfContainers: 1,
  weightPerContainer: 1000,
  effectiveDate: "",
  expiryDate: "",
  companyName: "",
  country: "",
  companyEmail: "",
});

const onFromPortSelected = (port: PortOption | null) => {
  formData.routeFrom = port ? port.value : "";
};

const onToPortSelected = (port: PortOption | null) => {
  formData.routeTo = port ? port.value : "";
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (!isValid) {
    return;
  }

  try {
    const result = await submitShippingQuote(formData);

    if (result.success) {
      console.log("Quote created successfully with ID:", result.id);
      formRef.value.reset();
      Object.assign(formData, {
        routeFrom: "",
        routeTo: "",
        commodity: "",
        containerType: "",
        numberOfContainers: 1,
        weightPerContainer: 1000,
        effectiveDate: "",
        expiryDate: "",
        companyName: "",
        country: "",
        companyEmail: "",
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>
