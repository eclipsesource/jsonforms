<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-img
              :src="require('./assets/logo.svg')"
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
          <v-col class="mb-5">
            <v-row>
              <JsonFormsDemo />
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import JsonFormsDemo from './components/JsonFormsDemo.vue';

export default Vue.extend({
  name: 'App',
  components: {
    JsonFormsDemo,
  },
});
</script>
