<script setup lang="ts">
import VuetifyLogo from '../assets/VuetifyLogo.vue';
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="text-center">
        <VuetifyLogo height="200" width="200" animate></VuetifyLogo
      ></v-col>
      <v-col cols="12" class="text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to JSON Forms Vue 3 Vuetify
        </h1>
        <h2 class="display-3 font-weight-bold mb-3">More Forms. Less Code.</h2>

        <p class="subheading font-weight-regular">
          For help and collaboration with other JSON Forms developers,
          <br />please join our online
          <a href="https://jsonforms.discourse.group" target="_blank"
            >Discourse Community</a
          >
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
