<template>
  <div v-if="control.visible">
    <dispatch-renderer
      :visible="control.visible"
      :enabled="control.enabled"
      :readonly="control.readonly"
      :schema="control.schema"
      :uischema="detailUiSchema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
    />
    <additional-properties
      v-if="showAdditionalProperties"
      :input="input"
    ></additional-properties>
  </div>
</template>

<script lang="ts">
import { IsDynamicPropertyContext } from '@/util/inject';
import {
  Generate,
  findUISchema,
  type ControlElement,
  type GroupLayout,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControlWithDetail,
  type RendererProps,
} from '@jsonforms/vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import { defineComponent, provide } from 'vue';
import { useNested, useVuetifyControl } from '../util';
import { AdditionalProperties } from './components';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
    AdditionalProperties,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useVuetifyControl(useJsonFormsControlWithDetail(props));

    const nested = useNested('object');

    // do not use the default value but the undefind so that
    // the property is cleared when property clear action is executed
    provide(IsDynamicPropertyContext, false);

    return {
      ...control,
      input: control,
      nested,
    };
  },
  computed: {
    hasAdditionalProperties(): boolean {
      return (
        !isEmpty(this.control.schema.patternProperties) ||
        isObject(this.control.schema.additionalProperties) ||
        this.control.schema.additionalProperties === true
      );
    },
    showAdditionalProperties(): boolean {
      return (
        this.hasAdditionalProperties ||
        (this.appliedOptions.allowAdditionalPropertiesIfMissing === true &&
          this.control.schema.additionalProperties === undefined)
      );
    },
    detailUiSchema(): UISchemaElement {
      const uiSchemaGenerator = () => {
        const uiSchema = Generate.uiSchema(
          this.control.schema,
          'Group',
          undefined,
          this.control.rootSchema,
        );
        if (isEmpty(this.control.path)) {
          uiSchema.type = 'VerticalLayout';
        } else {
          (uiSchema as GroupLayout).label = this.control.label;
        }
        return uiSchema;
      };

      let result = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        uiSchemaGenerator,
        this.control.uischema,
        this.control.rootSchema,
      );

      if (this.nested.level > 0) {
        result = cloneDeep(result);
        result.options = {
          ...result.options,
          bare: true,
          alignLeft:
            this.nested.level >= 4 || this.nested.parentElement === 'array',
        };
      }

      return result;
    },
  },
});

export default controlRenderer;
</script>
