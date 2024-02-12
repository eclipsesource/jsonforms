<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <DispatchCell
      :id="control.id + '-input'"
      :schema="schema"
      :uischema="uischema"
      :path="path"
      :enabled="enabled"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  and,
  ControlElement,
  isControl,
  isIntegerControl,
  isNumberControl,
  isStringControl,
  JsonFormsRendererRegistryEntry,
  or,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchCell,
  rendererProps,
  type RendererProps,
  useJsonFormsControl,
} from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const controlRenderer = defineComponent({
  name: 'InputControlRenderer',
  components: {
    ControlWrapper,
    DispatchCell,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(
      useJsonFormsControl(props),
      (target) => target.value || undefined
    );
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  //tester: rankWith(1, isControl),
  tester: rankWith(
    2,
    and(isControl, or(isStringControl, isIntegerControl, isNumberControl))
  ),
};
</script>
