<template>
  <div v-if="control.visible">
    <dispatch-renderer
      :visible="control.visible"
      :enabled="control.enabled"
      :schema="control.schema"
      :uischema="detailUiSchema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
    />
  </div>
</template>

<script lang="ts">
import {
  ControlElement,
  findUISchema,
  GroupLayout,
  isObjectControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
  UISchemaElement,
} from '@jsonforms/core';
import isEmpty from 'lodash/isEmpty';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsControlWithDetail,
} from '@jsonforms/vue2';
import { defineComponent } from '../vue';
import { useNested, useVuetifyControl } from '../util';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useVuetifyControl(useJsonFormsControlWithDetail(props));
    const nested = useNested('object');
    return {
      ...control,
      nested,
    };
  },
  computed: {
    detailUiSchema(): UISchemaElement {
      const result = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        'Group',
        this.control.uischema,
        this.control.rootSchema
      );

      // TODO: The following code can be streamlined once we have generator support
      // for 'findUISchema' in JSON Forms Core (https://github.com/eclipsesource/jsonforms/pull/1871)
      if (isEmpty(this.control.path)) {
        result.type = 'VerticalLayout';
      } else {
        (result as GroupLayout).label = this.control.label;
        if (this.nested.level > 0) {
          result.options = {
            ...result.options,
            bare: true,
            alignLeft:
              this.nested.level >= 4 || this.nested.parentElement === 'array',
          };
        }
      }
      return result;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isObjectControl),
};
</script>
