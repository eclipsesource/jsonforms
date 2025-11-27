<template>
  <string-control-renderer v-bind="$props">
    <template #prepend>
      <v-icon
        color="primary"
        class="mr-1"
        aria-hidden="true"
        tabindex="-1"
      >
        mdi-badge-account-horizontal-outline
      </v-icon>
    </template>
  </string-control-renderer>
</template>

<script setup lang="ts">
import { rendererProps } from '@jsonforms/vue';
import type { ControlElement } from '@jsonforms/core';
import StringControlRenderer from '../../src/controls/StringControlRenderer.vue';
import { VIcon } from 'vuetify/components';

defineProps(rendererProps<ControlElement>());
</script>
