<template>
  <v-main>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </v-main>
</template>

<script lang="ts">
export default { name: 'DefaultView' };
</script>
