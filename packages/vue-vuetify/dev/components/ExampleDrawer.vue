<script setup lang="ts">
import VuetifyLogo from '../assets/VuetifyLogo.vue';
import examples from '../examples';
import { useAppStore } from '../store';

const appStore = useAppStore();

const handleExampleClick = (exampleName: string) => {
  appStore.exampleName = exampleName;
};
</script>

<template>
  <v-navigation-drawer
    v-model="appStore.drawer"
    :location="appStore.rtl ? 'right' : 'left'"
  >
    <v-list-item>
      <template v-slot:prepend>
        <VuetifyLogo width="40" height="40" />
      </template>
      <v-list-item-title class="text-h6"> Examples </v-list-item-title>
      <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="example in examples"
        :key="example.name"
        :value="example.name"
        link
        color="primary"
        @click="handleExampleClick(example.name)"
      >
        <v-list-item-title>{{ example.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
