<template>
  <v-app>
    <default-app-bar v-if="!formonly" />

    <default-drawer v-if="!formonly" />

    <default-view />
  </v-app>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';

export default {
  name: 'DefaultLayout',

  components: {
    DefaultAppBar: defineAsyncComponent(() => import('./AppBar.vue')),
    DefaultDrawer: defineAsyncComponent(() => import('./Drawer.vue')),
    DefaultView: defineAsyncComponent(() => import('./View.vue')),
  },
  computed: {
    formonly(): boolean {
      return this.$route.query?.view === 'form-only';
    },
  },
};
</script>
