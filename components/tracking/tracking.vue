<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <div class="text-center mb-8">
          <v-icon
            icon="mdi-package-variant"
            size="64"
            color="primary"
            class="mb-4" />
          <h1 class="text-h3 mb-2">Track Your Shipment</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Enter your tracking ID and identification document to view shipment
            details
          </p>
        </div>

        <TrackingForm />
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title>
            <v-icon icon="mdi-information" class="me-2" />
            How to Track Your Shipment
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="text-center">
                  <v-icon
                    icon="mdi-numeric-1-circle"
                    size="48"
                    color="primary"
                    class="mb-2" />
                  <h3 class="text-h6 mb-2">Enter Tracking ID</h3>
                  <p class="text-body-2">
                    Input the tracking ID provided when you created your
                    shipment
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="text-center">
                  <v-icon
                    icon="mdi-numeric-2-circle"
                    size="48"
                    color="primary"
                    class="mb-2" />
                  <h3 class="text-h6 mb-2">Verify Identity</h3>
                  <p class="text-body-2">
                    Enter your identification document for security verification
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="text-center">
                  <v-icon
                    icon="mdi-numeric-3-circle"
                    size="48"
                    color="primary"
                    class="mb-2" />
                  <h3 class="text-h6 mb-2">View Details</h3>
                  <p class="text-body-2">
                    Access real-time updates and detailed shipment information
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Track Your Shipment - Nogal",
  description:
    "Track your shipment in real-time with our tracking system. Enter your tracking ID and document ID to get updates on your package.",
});
</script>
