<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
    <v-container>
      <!-- Port Information Section -->
      <v-row>
        <v-col cols="12">
          <h3>Port Information</h3>
        </v-col>
        <v-col cols="12" md="6">
          <FormsUnifiedPortSearch
            v-model="formData.portOfLoading"
            label="Port of Loading"
            placeholder="e.g., Rotterdam, Netherlands"
            required
            @port-selected="onLoadingPortSelected" />
        </v-col>
        <v-col cols="12" md="6">
          <FormsUnifiedPortSearch
            v-model="formData.portOfDischarge"
            label="Port of Discharge"
            placeholder="e.g., Singapore, Singapore"
            required
            @port-selected="onDischargePortSelected" />
        </v-col>
      </v-row>

      <!-- Booking Details Section -->
      <v-row>
        <v-col cols="12">
          <h3>Booking Details</h3>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.vesselDeparture"
            label="Vessel Departure"
            type="date"
            variant="outlined"
            required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.quotationContractNumber"
            label="Quotation / Contract Number"
            variant="outlined"
            required />
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
            {{ isSubmitting ? "Submitting..." : "Submit Booking Request" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { BookingForm } from "@/src/types/index";
import type { PortOption } from "~/src/types/ports.types";
import commoditiesData from "~/src/constants/commodities.json";
import containersData from "~/src/constants/containers.json";

const { submitBooking, loading, error, successMessage } = useRequests();

const formRef = ref();
const valid = ref(false);
const isSubmitting = computed(() => loading.value);
const submitMessage = computed(() => error.value || successMessage.value || "");
const submitSuccess = computed(() => !!successMessage.value);

const commodityOptions = commoditiesData;
const containerOptions = containersData;

const formData = reactive<BookingForm>({
  portOfLoading: "",
  portOfDischarge: "",
  vesselDeparture: "",
  quotationContractNumber: "",
  commodity: "",
  containerType: "",
  numberOfContainers: 1,
  weightPerContainer: 1000,
  companyName: "",
  country: "",
  companyEmail: "",
});

const onLoadingPortSelected = (port: PortOption | null) => {
  formData.portOfLoading = port ? port.value : "";
};

const onDischargePortSelected = (port: PortOption | null) => {
  formData.portOfDischarge = port ? port.value : "";
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (!isValid) {
    return;
  }

  try {
    const result = await submitBooking(formData);

    if (result.success) {
      console.log("Booking created successfully with ID:", result.id);
      formRef.value.reset();
      Object.assign(formData, {
        portOfLoading: "",
        portOfDischarge: "",
        vesselDeparture: "",
        quotationContractNumber: "",
        commodity: "",
        containerType: "",
        numberOfContainers: 1,
        weightPerContainer: 1000,
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
