<template>
  <integer-control-renderer v-bind="$props">
    <template #prepend>
      <v-tooltip :text="tempTooltip" location="bottom">
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            :color="tempColor"
            class="mr-1"
            aria-hidden="true"
            tabindex="-1"
          >
            {{ tempIcon }}
          </v-icon>
        </template>
      </v-tooltip>
    </template>

    <template #append>
      <v-icon>mdi-temperature-celsius</v-icon>
    </template>
  </integer-control-renderer>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import type { ControlElement } from '@jsonforms/core';
import IntegerControlRenderer from '../../src/controls/IntegerControlRenderer.vue';
import { VIcon, VTooltip } from 'vuetify/components';
import { computed } from 'vue';

const props = defineProps(rendererProps<ControlElement>());
const { control } = useJsonFormsControl(props);

// Determine temperature category (Celsius)
const category = computed(() => {
  const temp = control.value.data || 0;
  if (temp <= 5) return 'freezing';
  if (temp < 15) return 'cold';
  if (temp < 25) return 'comfortable';
  if (temp < 35) return 'hot';
  return 'extreme';
});

const tempIcon = computed(() => {
  const icons = {
    freezing: 'mdi-snowflake',
    cold: 'mdi-thermometer-low',
    comfortable: 'mdi-thermometer',
    hot: 'mdi-thermometer-high',
    extreme: 'mdi-thermometer-alert',
  };
  return icons[category.value];
});

const tempColor = computed(() => {
  const colors = {
    freezing: 'blue',
    cold: 'cyan',
    comfortable: 'success',
    hot: 'orange',
    extreme: 'error',
  };
  return colors[category.value];
});

const tempTooltip = computed(() => {
  const labels = {
    freezing: 'Very Cold (≤ 5°C)',
    cold: 'Cold (6-14°C)',
    comfortable: 'Comfortable (15-24°C)',
    hot: 'Hot (25-34°C)',
    extreme: 'Extreme Heat (35°C+)',
  };
  return labels[category.value];
});
</script>
