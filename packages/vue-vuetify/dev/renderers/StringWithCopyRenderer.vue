<!-- Copy to clipboard button in append slot -->
<template>
  <string-control-renderer v-bind="$props">
    <template #append>
      <!-- Replace the default clear button with our custom copy icon -->
      <v-tooltip :text="tooltipText" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-icon
            v-bind="tooltipProps"
            @click="copyToClipboard"
            style="cursor: pointer"
            :aria-label="`Copy ${control.label} to clipboard`"
            role="button"
          >
            {{ justCopied ? 'mdi-check' : 'mdi-content-copy' }}
          </v-icon>
        </template>
      </v-tooltip>
    </template>
  </string-control-renderer>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import type { ControlElement } from '@jsonforms/core';
import StringControlRenderer from '../../src/controls/StringControlRenderer.vue';
import { VIcon, VTooltip } from 'vuetify/components';
import { ref, computed } from 'vue';

const props = defineProps(rendererProps<ControlElement>());

const { control } = useJsonFormsControl(props);

const justCopied = ref(false);

const tooltipText = computed(() =>
  justCopied.value ? 'Copied!' : 'Copy to clipboard',
);

const copyToClipboard = async () => {
  if (control.value.data) {
    try {
      await navigator.clipboard.writeText(control.value.data);
      justCopied.value = true;

      // Reset after 1 second
      setTimeout(() => {
        justCopied.value = false;
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};
</script>
