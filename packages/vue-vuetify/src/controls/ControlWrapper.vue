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
  name: 'ControlWrapper',
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
