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
import { Generate, JsonSchema, Layout, UISchemaElement } from '@jsonforms/core';
import _ from 'lodash';
import { CompType, defineComponent } from '../../vue';
import { DispatchRenderer } from '@jsonforms/vue2';

interface CombinatorProps {
  schema: JsonSchema;
  combinatorKeyword: 'oneOf' | 'anyOf';
  path: string;
}

export default defineComponent({
  name: 'combinator-properties',
  components: {
    DispatchRenderer,
  },
  props: {
    schema: {
      type: Object as CompType<JsonSchema, ObjectConstructor>,
      required: true,
    },
    combinatorKeyword: {
      type: String as CompType<'oneOf' | 'anyOf', StringConstructor>,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  setup(props: CombinatorProps) {
    const otherProps: JsonSchema = _.omit(
      props.schema,
      props.combinatorKeyword
    ) as JsonSchema;
    const foundUISchema: UISchemaElement = Generate.uiSchema(
      otherProps,
      'VerticalLayout'
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
