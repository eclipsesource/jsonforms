<template>
  <component :is="WrapperComponent" v-bind="props">
    <slot />
  </component>
</template>

<script lang="ts">
import type { Styles } from '@/styles';
import type {
  AppliedOptions,
  ControlWrapperProps,
  ControlWrapperType,
} from '@/util';
import { ControlWrapperSymbol } from '@/util';
import { defineComponent, inject, type PropType } from 'vue';
import DefaultControlWrapper from './components/DefaultControlWrapper.vue';

export default defineComponent({
  name: 'control-wrapper',
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
  setup(props: ControlWrapperProps) {
    // Inject a custom wrapper if provided
    const WrapperComponent = inject<ControlWrapperType>(
      ControlWrapperSymbol,
      DefaultControlWrapper,
    ) as ControlWrapperType;

    return {
      WrapperComponent,
      props,
    };
  },
});
</script>
