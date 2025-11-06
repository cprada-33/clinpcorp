<template>
  <v-footer class="text-white bg-primary">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <h3 class="text-h5 font-weight-bold mb-3">
            Nogal Internacional Services Inc
          </h3>
          <p class="text-body-2 mb-4">
            Your trusted partner in global logistics and freight forwarding.
            Delivering excellence across continents.
          </p>
          <div class="d-flex ga-2">
            <v-btn
              icon="mdi-facebook"
              variant="text"
              size="small"
              color="white" />
            <v-btn
              icon="mdi-twitter"
              variant="text"
              size="small"
              color="white" />
            <v-btn
              icon="mdi-linkedin"
              variant="text"
              size="small"
              color="white" />
            <v-btn
              icon="mdi-instagram"
              variant="text"
              size="small"
              color="white" />
          </div>
        </v-col>

        <!-- Quick Links -->
        <v-col cols="6" md="2" class="mb-6 mb-md-0">
          <h4 class="font-weight-bold mb-3">Services</h4>
          <v-list density="compact" class="pa-0 bg-primary">
            <v-list-item class="px-0" min-height="32">
              Multimodal Logistic Agent
            </v-list-item>
            <v-list-item class="px-0" min-height="32">
              Freight Forwarder
            </v-list-item>
            <v-list-item class="px-0" min-height="32">
              Maritime Chartering
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Company Links -->
        <v-col cols="6" md="2" class="mb-6 mb-md-0">
          <h4 class="font-weight-bold mb-3">Company</h4>
          <v-list class="pa-0 bg-primary">
            <v-list-item
              to="/about"
              class="px-0"
              min-height="32"
              :active="false">
              About Us
            </v-list-item>
            <v-list-item
              to="/contact"
              class="px-0"
              min-height="32"
              :active="false">
              Contact
            </v-list-item>
            <v-list-item
              to="/#requests"
              class="px-0"
              min-height="32"
              :active="false">
              Get a Quote
            </v-list-item>
            <v-list-item
              to="/track"
              class="px-0"
              min-height="32"
              :active="false">
              Track Shipment
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="12" md="4">
          <h4 class="font-weight-bold mb-3">Contact</h4>
          <v-list class="pa-0 bg-primary">
            <v-list-item class="px-0" min-height="32">
              <template v-slot:prepend>
                <v-icon size="small" class="me-2">mdi-phone</v-icon>
              </template>
              {{ $t("contact.phone") }}
            </v-list-item>
            <v-list-item class="px-0" min-height="32">
              <template v-slot:prepend>
                <v-icon size="small" class="me-2">mdi-email</v-icon>
              </template>
              {{ $t("contact.email") }}
            </v-list-item>
            <v-list-item class="px-0" min-height="32">
              <template v-slot:prepend>
                <v-icon size="small" class="me-2">mdi-map-marker</v-icon>
              </template>
              {{ $t("contact.offices.usa.address") }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-6 border-opacity-25" />

      <v-row align="center">
        <v-col cols="12" md="6" class="text-center text-md-start">
          <p class="text-body-2 mb-0">
            {{ $t("common.copyright", { year: new Date().getFullYear() }) }}
            All rights reserved.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-end">
          <v-btn
            to="/admin"
            variant="text"
            size="small"
            color="grey-lighten-1"
            prepend-icon="mdi-shield-account">
            Admin Portal
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.v-footer {
  padding-top: 48px;
  padding-bottom: 24px;
}
</style>
