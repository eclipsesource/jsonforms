<script setup lang="ts">
import { ref, mergeProps } from 'vue';
import { useTheme } from 'vuetify';
import { getCustomThemes } from '../plugins/vuetify';
import { useAppStore } from '../store';

const currentTheme = useTheme();
const menu = ref(false);
const appStore = useAppStore();

const setTheme = (theme: string) => {
  menu.value = false;

  appStore.theme = theme;
};
</script>

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
              >$palette</v-icon
            >
          </v-btn>
        </template>
        Theme Colors
      </v-tooltip>
    </template>
    <v-toolbar flat>
      <v-toolbar-title
        >{{ currentTheme.current.value.dark ? 'Dark' : 'Light' }} Theme
        Colors</v-toolbar-title
      >
      <v-spacer />
      <v-toolbar-items>
        <v-btn icon @click="menu = false">
          <v-icon>$close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-divider />
    <v-card min-width="450px">
      <v-card-text>
        <v-card
          class="my-2"
          :disabled="currentTheme.name.value === theme.name"
          @click="setTheme(theme.name)"
          hover
          outlined
          v-for="(theme, index) in getCustomThemes(appStore.blueprint).filter(
            (theme) => theme.dark === currentTheme.current.value.dark,
          )"
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
                v-if="currentTheme.name.value === theme.name"
              >
                <v-icon>$complete</v-icon>
              </v-avatar>
            </v-list-item-action>
          </v-list-item>
          <div class="my-2">
            <v-chip
              class="mx-1"
              label
              :color="theme.colors![key]"
              v-for="(key, index) in Object.keys(theme.colors!)"
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
