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
          <v-col><theme-changer /> </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-btn
                  large
                  icon
                  dark
                  v-bind="props"
                  @click="app.settings = !app.settings"
                >
                  <v-icon size="30" color="primary">mdi-cog</v-icon>
                </v-btn>
              </template>
              Settings
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import ThemeChanger from '@/components/ThemeChanger.vue';
import { AppState } from '@/store/modules/types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultAppBar',
  components: {
    ThemeChanger,
  },
  setup() {
    const app = sync<AppState>('app/');
    return { app };
  },
  data() {
    return {
      activeTab: 0,
    };
  },
});
</script>
