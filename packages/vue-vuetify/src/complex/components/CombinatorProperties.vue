<template>
  <div v-if="isLayoutWithElements">
    <dispatch-renderer
      :schema="otherProps"
      :path="path"
      :uischema="foundUISchema"
    />
  </div>
</template>

<script lang="ts">
import {
  Generate,
  type JsonSchema,
  type Layout,
  type UISchemaElement,
} from '@jsonforms/core';
import { DispatchRenderer } from '@jsonforms/vue';
import omit from 'lodash/omit';
import { defineComponent, type PropType } from 'vue';

interface CombinatorProps {
  schema: JsonSchema;
  combinatorKeyword: 'oneOf' | 'anyOf' | 'allOf';
  path: string;
}

export default defineComponent({
  name: 'combinator-properties',
  components: {
    DispatchRenderer,
  },
  props: {
    schema: {
      type: Object as PropType<JsonSchema>,
      required: true,
    },
    combinatorKeyword: {
      type: String as PropType<'oneOf' | 'anyOf' | 'allOf'>,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  setup(props: CombinatorProps) {
    const otherProps: JsonSchema = omit(
      props.schema,
      props.combinatorKeyword,
    ) as JsonSchema;
    const foundUISchema: UISchemaElement = Generate.uiSchema(
      otherProps,
      'VerticalLayout',
    );

    const isLayout = (uischema: UISchemaElement): uischema is Layout =>
      Object.prototype.hasOwnProperty.call(uischema, 'elements');

    let isLayoutWithElements = false;
    if (foundUISchema !== null && isLayout(foundUISchema)) {
      isLayoutWithElements = foundUISchema.elements.length > 0;
    }

    return {
      otherProps,
      foundUISchema,
      isLayoutWithElements,
    };
  },
});
</script>
