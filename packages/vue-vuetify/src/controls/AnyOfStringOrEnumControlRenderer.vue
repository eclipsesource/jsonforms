<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-combobox
      v-disabled-icon-focus
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :label="computedLabel"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :model-value="control.data"
      :maxlength="
        appliedOptions.restrict ? control.schema.maxLength : undefined
      "
      :counter="
        control.schema.maxLength !== undefined
          ? control.schema.maxLength
          : undefined
      "
      :items="items"
      :clearable="control.enabled"
      v-bind="vuetifyProps('v-combobox')"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  and,
  rankWith,
  schemaMatches,
  uiTypeIs,
  type ControlElement,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
} from '@jsonforms/core';
import {
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VCombobox } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

const controlRenderer = defineComponent({
  name: 'anyof-string-or-enum-control-renderer',
  components: {
    ControlWrapper,
    VCombobox,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined,
    );
  },
  computed: {
    items(): string[] {
      // made sure via the testers
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return findEnumSchema(this.control.schema.anyOf!)!.enum!;
    },
  },
});

export default controlRenderer;

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find(
    (s) =>
      s.enum !== undefined && (s.type === 'string' || s.type === undefined),
  );
const findTextSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.type === 'string' && s.enum === undefined);

const hasEnumAndText = (schemas: JsonSchema[]): boolean => {
  // idea: map to type,enum and check that all types are string and at least one item is of type enum,
  const enumSchema = findEnumSchema(schemas);
  const stringSchema = findTextSchema(schemas);
  const remainingSchemas = schemas.filter(
    (s) => s !== enumSchema || s !== stringSchema,
  );
  const wrongType = remainingSchemas.find((s) => s.type && s.type !== 'string');
  return !!enumSchema && !!stringSchema && !wrongType;
};
const simpleAnyOf = and(
  uiTypeIs('Control'),
  schemaMatches(
    (schema) => Array.isArray(schema.anyOf) && hasEnumAndText(schema.anyOf),
  ),
);

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(5, simpleAnyOf),
};
</script>
