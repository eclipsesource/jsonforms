<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn
          large
          icon
          dark
          @click.stop="settings = !settings"
          v-on="onTooltip"
        >
          <v-icon size="30" color="primary">mdi-cog</v-icon>
        </v-btn>
      </template>
      Settings
    </v-tooltip>
    <v-navigation-drawer
      v-model="settings"
      :right="!$vuetify.rtl"
      app
      hide-overlay
      temporary
      width="300"
    >
      <v-toolbar flat>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="settings = false">
            <v-icon>$close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-divider />

      <v-container>
        <v-row><v-col>Theme</v-col></v-row>
        <v-row>
          <v-col>
            <v-btn-toggle
              v-model="$vuetify.theme.dark"
              borderless
              mandatory
              group
              color="primary"
              style="display: grid; grid-template-columns: 1fr 1fr"
            >
              <v-btn :value="false">
                <span class="hidden-sm-and-down">Light</span>

                <v-icon right> mdi-weather-sunny </v-icon>
              </v-btn>

              <v-btn :value="true">
                <span class="hidden-sm-and-down">Dark</span>

                <v-icon right> mdi-weather-night </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-container>
        <v-row><v-col>Direction</v-col></v-row>
        <v-row>
          <v-col>
            <v-btn-toggle
              v-model="$vuetify.rtl"
              borderless
              mandatory
              group
              color="primary"
              style="display: grid; grid-template-columns: 1fr 1fr"
            >
              <v-btn :value="false">
                <span class="hidden-sm-and-down">LTR</span>

                <v-icon right> mdi-format-textdirection-l-to-r</v-icon>
              </v-btn>

              <v-btn :value="true">
                <span class="hidden-sm-and-down">RTL</span>

                <v-icon right> mdi-format-textdirection-r-to-l </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-container>
        <v-row><v-col>Validation</v-col></v-row>
        <v-row>
          <v-col>
            <v-select
              outlined
              persistent-hint
              dense
              v-model="validationMode"
              :items="validationModes"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-container>
        <v-row><v-col>Locale (Mostly in basic example)</v-col></v-row>
        <v-row>
          <v-col>
            <v-select
              outlined
              persistent-hint
              dense
              v-model="locale"
              :items="locales"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-container>
        <v-row><v-col>Options</v-col></v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="hideRequiredAsterisk"
                  label="Hide Required Asterisk"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If asterisks in labels for required fields should be hidden
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="showUnfocusedDescription"
                  label="Show Unfocused Description"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If input descriptions should hide when not focused
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="restrict"
                  label="Restrict"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              Whether to restrict the number of characters to maxLength, if
              specified in the JSON schema
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="readonly"
                  label="Read-Only"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If true, sets all controls to read-only
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="collapseNewItems"
                  label="Collapse new items"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If true, new array items are not expanded by default
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="locale"
                  label="Switch between english and german locale"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              Only applies to basic example
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

export default {
  name: 'Settings',
  computed: {
    validationMode: sync('app/jsonforms@validationMode'),
    hideRequiredAsterisk: sync('app/jsonforms@config.hideRequiredAsterisk'),
    showUnfocusedDescription: sync(
      'app/jsonforms@config.showUnfocusedDescription'
    ),
    restrict: sync('app/jsonforms@config.restrict'),
    collapseNewItems: sync('app/jsonforms@config.collapseNewItems'),
    readonly: sync('app/jsonforms@readonly'),
    locale: sync('app/jsonforms@locale'),
  },
  data: function () {
    return {
      settings: false,
      validationModes: [
        { text: 'Validate And Show', value: 'ValidateAndShow' },
        { text: 'Validate And Hide', value: 'ValidateAndHide' },
        { text: 'No Validation', value: 'NoValidation' },
      ],
      locales: [
        { text: 'English (en)', value: 'en' },
        { text: 'German (de)', value: 'de' },
      ],
    };
  },
};
</script>
