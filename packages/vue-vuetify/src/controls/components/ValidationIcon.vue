<template>
  <validation-badge
    v-if="errors && errors.length > 0"
    :errors="errors"
    floating
  >
    <v-icon color="error">{{ icons.current.value.validationError }} </v-icon>
  </validation-badge>
</template>

<script lang="ts">
import { useIcons } from '@/util';
import type { ErrorObject } from 'ajv';
import { defineComponent, type PropType } from 'vue';
import { VIcon } from 'vuetify/components';
import { default as ValidationBadge } from './ValidationBadge.vue';

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
  setup() {
    const icons = useIcons();

    return { icons };
  },
});
</script>
