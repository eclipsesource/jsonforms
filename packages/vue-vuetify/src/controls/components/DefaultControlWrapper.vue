<template>
  <div v-if="visible" :class="styles?.control.root" :id="id">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import type { Styles } from '@/styles';
import type { AppliedOptions, ControlWrapperProps } from '@/util';
import { defineComponent, type DefineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'default-control-wrapper',
  props: {
    id: { type: String },
    description: { type: String },
    errors: { type: String },
    label: { type: String },
    visible: { type: Boolean },
    required: { type: Boolean },
    isFocused: { type: Boolean },
    styles: { type: Object as PropType<Styles> },
    appliedOptions: {
      type: Object as PropType<AppliedOptions>,
    },
  },
}) as DefineComponent<ControlWrapperProps>;
</script>
