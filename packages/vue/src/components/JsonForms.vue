<template>
  <dispatch-renderer
    v-bind:schema="jsonforms.core.schema"
    v-bind:uischema="jsonforms.core.uischema"
    v-bind:path="''"
  />
</template>

<script lang="ts">
import { PropType } from 'vue';
import { defineComponent } from '../../config';
import {
  coreReducer,
  Actions,
  Generate,
  configReducer,
  JsonSchema,
  UISchemaElement,
  ValidationMode,
  JsonFormsCore,
  JsonFormsUISchemaRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  CoreActions
} from '@jsonforms/core';
import { JsonFormsChangeEvent } from '../types';
import DispatchRenderer from './DispatchRenderer.vue';

import { Ajv } from 'ajv';
import RefParser from 'json-schema-ref-parser';

const isObject = (elem: any): elem is Object => {
  return elem && typeof elem === 'object';
};

export default defineComponent({
  name: 'json-forms',
  components: {
    DispatchRenderer
  },
  emits: ['change'],
  props: {
    data: {
      required: true,
      type: [String, Number, Boolean, Array, Object] as PropType<any>
    },
    schema: {
      required: false,
      type: [Object, Boolean] as PropType<JsonSchema>,
      default: undefined
    },
    uischema: {
      required: false,
      type: Object as PropType<UISchemaElement>,
      default: undefined
    },
    renderers: {
      required: true,
      type: Array as PropType<JsonFormsRendererRegistryEntry[]>
    },
    cells: {
      required: false,
      type: Array as PropType<JsonFormsCellRendererRegistryEntry[]>,
      default: () =>[]
    },
    config: {
      required: false,
      type: Object as PropType<any>,
      default: undefined
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    },
    uischemas: {
      required: false,
      type: Array as PropType<JsonFormsUISchemaRegistryEntry[]>,
      default: () => []
    },
    validationMode: {
      required: false,
      type: String as PropType<ValidationMode>,
      default: 'ValidateAndShow'
    },
    ajv: {
      required: false,
      type: Object as PropType<Ajv>,
      default: undefined
    },
    refParserOptions: {
      required: false,
      type: Object as PropType<RefParser.Options>,
      default: undefined
    }
  },
  data() {
    const generatorData = isObject(this.data) ? this.data : {};
    const schemaToUse = this.schema ?? Generate.jsonSchema(generatorData);
    const uischemaToUse = this.uischema ?? Generate.uiSchema(schemaToUse);
    const initCore = (): JsonFormsCore => {
      const initialCore = {
        data: this.data,
        schema: schemaToUse,
        uischema: uischemaToUse
      };
      const core = coreReducer(
        initialCore,
        Actions.init(this.data, schemaToUse, uischemaToUse, {
          validationMode: this.validationMode,
          ajv: this.ajv,
          refParserOptions: this.refParserOptions
        })
      );
      return core;
    };
    return {
      schemaToUse,
      uischemaToUse,
      jsonforms: {
        core: initCore(),
        config: configReducer(undefined, Actions.setConfig(this.config)),
        renderers: this.renderers,
        cells: this.cells,
        uischemas: this.uischemas,
        readonly: this.readonly
      }
    };
  },
  watch: {
    schema(newSchema) {
      console.log("schema updated");
      const generatorData = isObject(this.data) ? this.data : {};
      this.schemaToUse = newSchema ?? Generate.jsonSchema(generatorData);
      if (!this.uischema) {
        this.uischemaToUse = Generate.uiSchema(this.schemaToUse);
      }
    },
    uischema(newUischema) {
      console.log("uischema updated");
      this.uischemaToUse = newUischema ?? Generate.uiSchema(this.schemaToUse);
    },
    renderers(newRenderers) {
      this.jsonforms.renderers = newRenderers;
    },
    cells(newCells) {
      this.jsonforms.cells = newCells;
    },
    uischemas(newUischemas) {
      this.jsonforms.uischemas = newUischemas;
    },
    config(newConfig) {
      this.jsonforms.config = configReducer(
        undefined,
        Actions.setConfig(newConfig)
      );
    },
    readonly(newReadonly) {
      this.jsonforms.readonly = newReadonly;
    },
    coreDataToUpdate() {
      this.jsonforms.core = coreReducer(
        this.jsonforms.core,
        Actions.updateCore(this.data, this.schemaToUse, this.uischemaToUse, {
          validationMode: this.validationMode,
          ajv: this.ajv,
          refParserOptions: this.refParserOptions
        })
      );
    },
    eventToEmit(newEvent) {
      this.$emit('change', newEvent);
    }
  },
  computed: {
    coreDataToUpdate(): any {
      return [
        this.data,
        this.schemaToUse,
        this.uischemaToUse,
        this.validationMode,
        this.ajv,
        this.refParserOptions
      ];
    },
    eventToEmit(): JsonFormsChangeEvent {
      return {
        data: this.jsonforms.core.data,
        errors: this.jsonforms.core.errors
      };
    }
  },
  mounted() {
    // emit an inital change so clients can react to error validation and default data insertion
    this.$emit('change', {
      data: this.jsonforms.core.data,
      errors: this.jsonforms.core.errors
    });
  },
  methods: {
    dispatch(action: CoreActions) {
      this.jsonforms.core = coreReducer(this.jsonforms.core, action);
    }
  },
  provide() {
    return {
      jsonforms: this.jsonforms,
      dispatch: this.dispatch
    };
  }
});
</script>
