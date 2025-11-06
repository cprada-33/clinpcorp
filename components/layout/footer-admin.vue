<template>
  <v-footer color="grey-darken-4" class="text-white">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6" class="text-center text-md-start">
          <p class="text-body-2 text-grey-lighten-1 mb-0">
            {{ $t("common.copyright", { year: new Date().getFullYear() }) }}
            Nogal Logistics - Admin Portal
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-end">
          <v-btn
            to="/help"
            variant="text"
            size="small"
            color="grey-lighten-1"
            prepend-icon="mdi-help-circle">
            Help
          </v-btn>
          <v-btn
            to="/terms"
            variant="text"
            size="small"
            color="grey-lighten-1">
            Terms
          </v-btn>
          <v-btn
            to="/privacy"
            variant="text"
            size="small"
            color="grey-lighten-1">
            Privacy
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
// Admin footer component - simplified version
</script>

<style scoped>
.v-footer {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
