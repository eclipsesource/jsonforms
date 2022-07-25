<template>
  <v-app>
    <default-app-bar v-if="!formonly" />

    <default-drawer v-if="!formonly" />

    <default-view />
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'DefaultLayout',

  components: {
    DefaultAppBar: () => import('./AppBar'),
    DefaultDrawer: () => import('./Drawer'),
    DefaultView: () => import('./View'),
  },
  computed: {
    formonly(): boolean {
      return this.$route.query?.view === 'form-only';
    },
  },
};
</script>
