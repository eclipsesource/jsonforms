<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script lang="ts">
export default { name: 'App' };
</script>

<style scoped>
@import '~@jsonforms/vue2-vuetify/lib/jsonforms-vue2-vuetify.esm.css';
</style>
