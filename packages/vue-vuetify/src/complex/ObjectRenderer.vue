<template>
  <div v-if="control.visible && isRootObject">
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
  <v-card
    v-else-if="control.visible"
    :class="objectCardClasses"
    :outlined="nested.level > 0"
  >
    <v-card-title v-if="objectLabel">{{ objectLabel }}</v-card-title>
    <v-card-text>
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { IsDynamicPropertyContext } from '@/util/inject';
import {
  Generate,
  findUISchema,
  type ControlElement,
  type GroupLayout,
  type Layout,
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
import { VCard, VCardText, VCardTitle } from 'vuetify/components';
import { useNested, useVuetifyControl } from '../util';
import { AdditionalProperties } from './components';

const controlRenderer = defineComponent({
  name: 'object-renderer',
  components: {
    DispatchRenderer,
    AdditionalProperties,
    VCard,
    VCardText,
    VCardTitle,
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
    isRootObject(): boolean {
      return isEmpty(this.control.path);
    },
    objectLabel(): string | undefined {
      return this.isRootObject ? undefined : this.control.label;
    },
    objectCardClasses(): string {
      const classes = ['my-1', 'pa-0'];
      if (this.nested.level > 0) {
        classes.push('group-bare');
      }
      return classes.join(' ');
    },
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
        return Generate.uiSchema(
          this.control.schema,
          'VerticalLayout',
          undefined,
          this.control.rootSchema
        );
      };

      let result = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        uiSchemaGenerator,
        this.control.uischema,
        this.control.rootSchema
      );

      if (this.nested.level > 0) {
        result = cloneDeep(result);
        if (result.type === 'Group') {
          result = {
            ...result,
            type: 'VerticalLayout',
            elements: (result as GroupLayout).elements,
          } as Layout;
        }
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
