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
              attach
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
                  label="Collapse new array items"
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
                  v-model="hideArraySummaryValidation"
                  label="Hide array summary validation"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If true, the summary of validation errors in arrays is hidden
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="initCollapsed"
                  label="Collapse arrays initially"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              If true, arrays are not expanded initially
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on: onTooltip }">
                <v-switch
                  v-model="hideAvatar"
                  label="Hide Array Item Avatar"
                  v-on="onTooltip"
                ></v-switch>
              </template>
              Whether the array index avatars shall be shown
            </v-tooltip>
          </v-col>
        </v-row>
        <v-container>
          <v-row>
            <v-row><v-col>Break horizontal layouts</v-col></v-row>
            <v-col>
              <v-select
                outlined
                persistent-hint
                dense
                v-model="breakHorizontal"
                :items="breakHorizontals"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
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
    initCollapsed: sync('app/jsonforms@config.initCollapsed'),
    breakHorizontal: sync('app/jsonforms@config.breakHorizontal'),
    readonly: sync('app/jsonforms@readonly'),
    locale: sync('app/jsonforms@locale'),
    hideAvatar: sync('app/jsonforms@config.hideAvatar'),
    hideArraySummaryValidation: sync(
      'app/jsonforms@config.hideArraySummaryValidation'
    ),
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
      breakHorizontals: [
        { text: 'None', value: false },
        { text: 'xs', value: 'xs' },
        { text: 'sm', value: 'sm' },
        { text: 'md', value: 'md' },
        { text: 'lg', value: 'lg' },
        { text: 'xl', value: 'xl' },
      ],
    };
  },
};
</script>
