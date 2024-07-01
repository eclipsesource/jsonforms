<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <RadioGroupControl
      :id="control.id"
      :options="control.options"
      :enabled="control.enabled"
      :required="control.required"
      :styles="styles"
      :on-change="onChange"
    />
  </control-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  and,
  type ControlElement,
  isEnumControl,
  type JsonFormsRendererRegistryEntry,
  optionIs,
  rankWith,
} from '@jsonforms/core';
import {
  rendererProps,
  type RendererProps,
  useJsonFormsEnumControl,
} from '@jsonforms/vue';
import { ControlWrapper } from '../controls';
import { useVanillaControl } from '../util';
import RadioGroupControl from './components/RadioGroupControl.vue';

const controlRenderer = defineComponent({
  name: 'RadioGroupControlRenderer',
  components: {
    RadioGroupControl,
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsEnumControl(props));
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(20, and(isEnumControl, optionIs('format', 'radio'))),
};
</script>
