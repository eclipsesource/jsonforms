<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ props: propsMenu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ props: propsTooltip }">
          <v-btn large icon dark>
            <v-icon
              size="30"
              color="primary"
              v-bind="mergeProps(propsMenu, propsTooltip)"
              >mdi-palette</v-icon
            >
          </v-btn>
        </template>
        Theme Colors
      </v-tooltip>
    </template>
    <v-toolbar flat>
      <v-toolbar-title>Theme Colors</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn icon @click="menu = false">
          <v-icon>$close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-divider />
    <v-card>
      <v-card-text>
        <v-card
          class="my-2"
          :disabled="$vuetify.theme.currentTheme.name === theme.name"
          @click="setTheme(theme)"
          hover
          outlined
          v-for="(theme, index) in themes"
          :key="index"
        >
          <v-list-item>
            <v-list-item-title class="font-weight-bold">
              {{ theme.name }}</v-list-item-title
            >
            <v-list-item-action>
              <v-avatar
                color="success"
                size="30"
                v-if="$vuetify.theme.currentTheme.name === theme.name"
              >
                <v-icon>mdi-check</v-icon>
              </v-avatar>
            </v-list-item-action>
          </v-list-item>
          <div class="my-2">
            <v-chip
              class="mx-1"
              label
              :color="theme.dark[key]"
              v-for="(key, index) in Object.keys(theme.dark)"
              :key="index"
            >
              {{ key }}</v-chip
            >
          </div>
          <div class="my-2">
            <v-chip
              class="mx-1"
              label
              :color="theme.light[key]"
              v-for="(key, index) in Object.keys(theme.light)"
              :key="index"
            >
              {{ key }}</v-chip
            >
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { VuetifyThemeVariant } from 'vuetify/types/services/theme';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { mergeProps } from 'vue';

const defaultTheme = {
  name: 'Default',
  light: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  dark: {
    primary: '#2196F3',
    secondary: '#424242',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

export default {
  name: 'ThemeChanger',
  data: () => ({
    menu: false,
    themes: [
      defaultTheme,
      {
        ...merge(cloneDeep(defaultTheme), {
          name: 'Basil',
          light: {
            primary: '#356859',
            secondary: '#FD5523',
            accent: '#37966F',
            info: '#356859',
          },
        }),
      },
      {
        ...merge(cloneDeep(defaultTheme), {
          name: 'Crane',
          light: {
            primary: '#5D1049',
            secondary: '#E30425',
            accent: '#4E0D3A',
            info: '#5D1049',
          },
        }),
      },
      {
        ...merge(cloneDeep(defaultTheme), {
          name: 'Fortnightly',
          light: {
            primary: '#6B38FB',
            secondary: '#6B38FB',
            info: '#6B38FB',
          },
        }),
      },
      {
        ...merge(cloneDeep(defaultTheme), {
          name: 'Owl',
          light: {
            primary: '#FFDE03',
            secondary: '#0336FF',
            accent: '#FF0266',
            info: '#FFDE03',
          },
        }),
      },
      {
        ...merge(cloneDeep(defaultTheme), {
          name: 'Shrine',
          light: {
            primary: '#FEDBD0',
            secondary: '#FEEAE6',
            accent: '#442C2E',
            info: '#FEDBD0',
          },
        }),
      },
    ],
  }),
  methods: {
    setTheme(theme: {
      name: string;
      dark: VuetifyThemeVariant;
      light: VuetifyThemeVariant;
    }) {
      // close menu
      this.menu = false;
      const name = theme.name;
      const dark = theme.dark;
      const light = theme.light;
      // set themes
      Object.keys(dark).forEach((i) => {
        this.$vuetify.theme.themes.dark[i] = dark[i];
      });
      Object.keys(light).forEach((i) => {
        this.$vuetify.theme.themes.light[i] = light[i];
      });
      // also save theme name to disable selection
      this.$vuetify.theme.currentTheme.name = name;
    },
    mergeProps,
  },
};
</script>
<style scoped></style>
