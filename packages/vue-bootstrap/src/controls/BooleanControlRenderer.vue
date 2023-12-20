<template>
  <div class="form-check">
      <input
        :id="control.id + '-input'"
        type="checkbox"
        class="form-check-input"
        :checked="!!control.data"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    <label
      class="form-label"
      v-bind="controlWrapper"
      :for="control.id + '-input'"
      :styles="styles"
      :is-focused="isFocused"
      :applied-options="appliedOptions"
    >{{control.label}}</label>
  </div>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isBooleanControl,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '../../config/jsonforms';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVanillaControl } from '../util';

const controlRenderer = defineComponent({
  name: 'BooleanControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(
      useJsonFormsControl(props),
      (target) => target.checked
    );
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isBooleanControl),
};
</script>
