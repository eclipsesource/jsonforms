<template>
  <validation-badge v-if="errors && errors.length > 0" :errors="errors">
    <v-icon color="error">mdi-alert-circle-outline</v-icon>
  </validation-badge>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ErrorObject } from 'ajv';
import { default as ValidationBadge } from './ValidationBadge.vue';
import { VIcon } from 'vuetify/components';

export default defineComponent({
  name: 'validation-icon',
  components: {
    ValidationBadge,
    VIcon,
  },
  props: {
    errors: {
      required: true,
      type: Array as PropType<ErrorObject[]>,
    },
  },
});
</script>
