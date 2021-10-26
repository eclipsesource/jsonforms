<template>
  <v-app>
    <default-app-bar />

    <default-drawer />

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
};
</script>
