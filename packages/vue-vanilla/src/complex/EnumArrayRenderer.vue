<template>
  <div v-for="(checkElement, index) in control.options" :key="index">
    <input
      :id="control.id + `-input-${index}`"
      type="checkbox"
      :class="styles.control.input"
      :value="checkElement.value"
      :checked="dataHasEnum(checkElement.value)"
      :disabled="!control.enabled"
      :placeholder="appliedOptions?.placeholder"
      @change="(event) => toggle(checkElement.value, event.target.checked)"
    />
    <label :for="control.id + `-input-${index}`">
      {{ checkElement.label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  RendererProps,
  rendererProps,
  useJsonFormsMultiEnumControl,
} from '@jsonforms/vue';
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  uiTypeIs,
  and,
  schemaMatches,
  hasType,
  schemaSubPathMatches,
  JsonSchema,
} from '@jsonforms/core';
import { useVanillaArrayControl } from '../util';

const controlRenderer = defineComponent({
  name: 'EnumArrayRenderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useJsonFormsMultiEnumControl(props);

    return useVanillaArrayControl(control);
  },
  methods: {
    dataHasEnum(value: any): boolean {
      return !!this.control.data?.includes(value);
    },
    toggle(value: any, checked: boolean): void {
      if (checked) {
        this.addItem(this.control.path, value);
      } else {
        this.removeItem?.(this.control.path, value);
      }
    },
  },
});

export default controlRenderer;

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined;
  });

const hasEnumItems = (schema: JsonSchema): boolean =>
  schema.type === 'string' && schema.enum !== undefined;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    5,
    and(
      uiTypeIs('Control'),
      and(
        schemaMatches(
          (schema) =>
            hasType(schema, 'array') &&
            !Array.isArray(schema.items) &&
            schema.uniqueItems === true
        ),
        schemaSubPathMatches('items', (schema) => {
          return hasOneOfItems(schema) || hasEnumItems(schema);
        })
      )
    )
  ),
};
</script>