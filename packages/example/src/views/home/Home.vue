<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-img
          :src="require('@/assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col cols="12" class="text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to JSON Forms Vue 2 Vuetify
        </h1>

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

<script lang="ts">
export default {
  name: 'HomeView',
};
</script>
