<script setup lang="ts">
import { useAppStore } from '../store';
import JsonFormsLogo from '../assets/JsonFormsLogo.vue';
import ThemeChanger from './ThemeChanger.vue';

const appStore = useAppStore();
</script>

<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      aria-label="Toggle Navigation Drawer"
      @click="appStore.drawer = !appStore.drawer"
    />
    <v-toolbar-title>
      <v-container fill-height fluid
        ><v-row align="center" justify="center" dense>
          <JsonFormsLogo width="40" height="40"></JsonFormsLogo>
          <v-col>JSON Forms </v-col>
        </v-row>
      </v-container>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-container fill-height fluid justify-end
        ><v-row dense>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  :disabled="!appStore.exampleName"
                  @click="appStore.formOnly = !appStore.formOnly"
                >
                  <v-icon size="30" color="primary">$formOnly</v-icon>
                </v-btn>
              </template>
              {{
                appStore.formOnly ? `Show Form Wrapper` : `Hide Form Wrapper`
              }}
            </v-tooltip>
          </v-col>
          <v-col><theme-changer /> </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-btn
                  large
                  icon
                  dark
                  v-bind="props"
                  @click="appStore.settings = !appStore.settings"
                >
                  <v-icon size="30" color="primary">$settings</v-icon>
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
