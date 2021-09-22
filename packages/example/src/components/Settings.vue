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
              v-model="validationModeData"
              :items="validationModes"
              @change="$emit('validation-changed', validationModeData)"
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
                  v-model="hideRequiredAsteriskData"
                  label="Hide Required Asterisk"
                  v-on="onTooltip"
                  @change="
                    $emit(
                      'hide-required-asterisk-changed',
                      hideRequiredAsteriskData
                    )
                  "
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
                  v-model="showUnfocusedDescriptionData"
                  label="Show Unfocused Description"
                  v-on="onTooltip"
                  @change="
                    $emit(
                      'show-unfocused-description-changed',
                      showUnfocusedDescriptionData
                    )
                  "
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
                  v-model="restrictData"
                  label="Restrict"
                  v-on="onTooltip"
                  @change="$emit('restrict-changed', restrictData)"
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
                  v-model="readonlyData"
                  label="Read-Only"
                  v-on="onTooltip"
                  @change="$emit('readonly-changed', readonlyData)"
                ></v-switch>
              </template>
              If true, sets all controls to read-only
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Settings',
  props: {
    validationMode: { type: String, required: true },
    showUnfocusedDescription: { type: Boolean, required: true },
    hideRequiredAsterisk: { type: Boolean, required: true },
    readonly: { type: Boolean, required: true },
    restrict: { type: Boolean, required: true },
  },
  data: function () {
    return {
      settings: false,
      validationModeData: this.validationMode,
      validationModes: [
        { text: 'Validate And Show', value: 'ValidateAndShow' },
        { text: 'Validate And Hide', value: 'ValidateAndHide' },
        { text: 'No Validation', value: 'NoValidation' },
      ],
      hideRequiredAsteriskData: this.hideRequiredAsterisk,
      showUnfocusedDescriptionData: this.showUnfocusedDescription,
      readonlyData: this.readonly,
      restrictData: this.restrict,
    };
  },
};
</script>
<style scoped></style>
