<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      aria-label="Toggle Navigation Drawer"
      @click="app.drawer = !app.drawer"
    />

    <v-toolbar-title>
      <v-container fill-height fluid
        ><v-row align="center" justify="center">
          <v-col>
            <v-img
              :src="require('@/assets/jsonforms.svg')"
              max-height="64"
              max-width="64"
            />
          </v-col>
          <v-col>JSON Forms </v-col>
        </v-row></v-container
      ></v-toolbar-title
    >

    <v-spacer expand></v-spacer>

    <v-toolbar-items>
      <v-container fill-height fluid justify-end
        ><v-row dense>
          <v-col><settings /> </v-col>
          <v-col><theme-changer /> </v-col>
        </v-row>
      </v-container>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import Settings from '@/components/Settings.vue';
import ThemeChanger from '@/components/ThemeChanger.vue';
import { AppStore } from '../store/modules/types';

export default {
  name: 'DefaultAppBar',
  components: {
    ThemeChanger,
    Settings,
  },
  computed: {
    app: sync<AppStore>('app/'),
  },
  data() {
    return {
      activeTab: 0,
    };
  },
};
</script>
