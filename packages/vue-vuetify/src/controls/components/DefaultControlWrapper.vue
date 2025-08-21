<template>
  <div v-if="visible" :class="styles.control.root" :id="id">
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
    id: { type: String, required: true },
    description: { type: String, required: true },
    errors: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, required: true },
    required: { type: Boolean, required: true },
    isFocused: { type: Boolean, required: true },
    styles: { type: Object as PropType<Styles>, required: true },
    appliedOptions: {
      type: Object as PropType<AppliedOptions>,
      required: true,
    },
  },
}) as DefineComponent<ControlWrapperProps>;
</script>
