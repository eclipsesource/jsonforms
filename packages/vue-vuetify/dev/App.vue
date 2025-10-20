<script setup lang="ts">
import { computed } from 'vue';
import ExampleAppBar from './components/ExampleAppBar.vue';
import ExampleDrawer from './components/ExampleDrawer.vue';
import ExampleSettings from './components/ExampleSettings.vue';

import ExampleView from './views/ExampleView.vue';
import HomeView from './views/HomeView.vue';

import examples from './examples';
import { getCustomThemes } from './plugins/vuetify';
import { useAppStore } from './store';

const appStore = useAppStore();

const example = computed(() =>
  examples.find((ex) => ex.name === appStore.exampleName),
);

const theme = computed(() => {
  const theme = getCustomThemes(appStore.blueprint).filter(
    (t) => t.name === appStore.theme,
  );
  if (theme && theme[0] && theme[0].dark === appStore.dark) {
    return theme[0].name;
  }

  return appStore.dark ? 'dark' : 'light';
});
</script>

<template>
  <v-locale-provider :rtl="appStore.rtl">
    <v-theme-provider :theme="theme">
      <v-app>
        <example-app-bar></example-app-bar>
        <example-drawer></example-drawer>
        <example-settings></example-settings>
        <suspense>
          <v-main>
            <example-view v-if="example" :example="example"></example-view>
            <home-view v-else></home-view>
          </v-main>
        </suspense>
      </v-app>
    </v-theme-provider>
  </v-locale-provider>
</template>

<style>
@import '@jsonforms/vue-vuetify/lib/jsonforms-vue-vuetify.css';
</style>
