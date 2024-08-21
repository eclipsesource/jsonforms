<template>
  <v-app>
    <default-app-bar v-if="!formonly" />

    <default-drawer v-if="!formonly" />

    <default-settings v-if="!formonly" />
    <default-view />
  </v-app>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultLayout',

  components: {
    DefaultAppBar: defineAsyncComponent(() => import('./AppBar.vue')),
    DefaultDrawer: defineAsyncComponent(() => import('./Drawer.vue')),
    DefaultSettings: defineAsyncComponent(
      () => import('../../components/Settings.vue')
    ),
    DefaultView: defineAsyncComponent(() => import('./View.vue')),
  },
  computed: {
    formonly(): boolean {
      return this.$route.query?.view === 'form-only';
    },
  },
});
</script>
