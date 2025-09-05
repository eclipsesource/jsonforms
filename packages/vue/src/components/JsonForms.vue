<template>
  <dispatch-renderer
    :schema="jsonforms.core.schema"
    :uischema="jsonforms.core.uischema"
    :path="''"
  />
</template>

<script lang="ts">
import { PropType, reactive, defineComponent } from 'vue';
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
  CoreActions,
  i18nReducer,
  JsonFormsI18nState,
  defaultMiddleware,
  Middleware,
  JsonFormsSubStates,
  Layout,
} from '@jsonforms/core';
import { JsonFormsChangeEvent, MaybeReadonly } from '../types';
import DispatchRenderer from './DispatchRenderer.vue';

import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';

const EMPTY: ErrorObject[] = reactive([]);

const createDefaultLayout = (): Layout => ({
  type: 'VerticalLayout',
  elements: [],
});
const generateUISchema = (schema: JsonSchema) =>
  Generate.uiSchema(schema, undefined, undefined, schema) ??
  createDefaultLayout();

export default defineComponent({
  name: 'JsonForms',
  components: {
    DispatchRenderer,
  },
  provide() {
    return {
      // Explicitly type provide to avoid TS7056
      jsonforms: this.jsonforms as JsonFormsSubStates,
      dispatch: this.dispatch,
    };
  },
  props: {
    data: {
      required: false,
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
      default: undefined,
    },
    schema: {
      required: false,
      type: [Object, Boolean] as PropType<JsonSchema>,
      default: undefined,
    },
    uischema: {
      required: false,
      type: Object as PropType<UISchemaElement>,
      default: undefined,
    },
    renderers: {
      required: true,
      type: Array as PropType<MaybeReadonly<JsonFormsRendererRegistryEntry[]>>,
    },
    cells: {
      required: false,
      type: Array as PropType<
        MaybeReadonly<JsonFormsCellRendererRegistryEntry[]>
      >,
      default: () => [],
    },
    config: {
      required: false,
      type: Object as PropType<any>,
      default: undefined,
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false,
    },
    uischemas: {
      required: false,
      type: Array as PropType<MaybeReadonly<JsonFormsUISchemaRegistryEntry[]>>,
      default: () => [],
    },
    validationMode: {
      required: false,
      type: String as PropType<ValidationMode>,
      default: 'ValidateAndShow',
    },
    ajv: {
      required: false,
      type: Object as PropType<Ajv>,
      default: undefined,
    },
    i18n: {
      required: false,
      type: Object as PropType<JsonFormsI18nState>,
      default: undefined,
    },
    additionalErrors: {
      required: false,
      type: Array as PropType<ErrorObject[]>,
      default: () => EMPTY,
    },
    middleware: {
      required: false,
      type: Function as PropType<Middleware>,
      default: defaultMiddleware,
    },
  },
  emits: ['change'],
  data() {
    const dataToUse = this.data === undefined ? {} : this.data;
    const schemaToUse: JsonSchema =
      this.schema ?? Generate.jsonSchema(dataToUse);
    const uischemaToUse = this.uischema ?? generateUISchema(schemaToUse);
    const initCore = (): JsonFormsCore => {
      const initialCore = {
        data: dataToUse,
        schema: schemaToUse,
        uischema: uischemaToUse,
      };
      const core = this.middleware(
        initialCore,
        Actions.init(dataToUse, schemaToUse, uischemaToUse, {
          validationMode: this.validationMode,
          ajv: this.ajv,
          additionalErrors: this.additionalErrors,
        }),
        coreReducer
      );
      return core;
    };
    return {
      schemaToUse,
      dataToUse,
      uischemaToUse,
      jsonforms: {
        core: initCore(),
        config: configReducer(undefined, Actions.setConfig(this.config)),
        i18n: i18nReducer(
          this.i18n,
          Actions.updateI18n(
            this.i18n?.locale,
            this.i18n?.translate,
            this.i18n?.translateError
          )
        ),
        renderers: this.renderers,
        cells: this.cells,
        uischemas: this.uischemas,
        readonly: this.readonly,
      },
    };
  },
  computed: {
    coreDataToUpdate(): any {
      return [
        this.dataToUse,
        this.schemaToUse,
        this.uischemaToUse,
        this.validationMode,
        this.ajv,
        this.additionalErrors,
      ];
    },
    eventToEmit(): JsonFormsChangeEvent {
      return {
        data: this.jsonforms.core.data,
        errors: this.jsonforms.core.errors,
      };
    },
  },
  watch: {
    schema(newSchema) {
      this.schemaToUse = newSchema ?? Generate.jsonSchema(this.dataToUse);
      if (!this.uischema) {
        this.uischemaToUse = generateUISchema(this.schemaToUse);
      }
    },
    uischema(newUischema) {
      this.uischemaToUse = newUischema ?? generateUISchema(this.schemaToUse);
    },
    data(newData) {
      this.dataToUse = newData === undefined ? {} : newData;

      if (!this.schema) {
        this.schemaToUse = Generate.jsonSchema(this.dataToUse);
        if (!this.uischema) {
          this.uischemaToUse = generateUISchema(this.schemaToUse);
        }
      }
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
    config: {
      handler(newConfig) {
        this.jsonforms.config = configReducer(
          undefined,
          Actions.setConfig(newConfig)
        );
      },
      deep: true,
    },
    readonly(newReadonly) {
      this.jsonforms.readonly = newReadonly;
    },
    coreDataToUpdate() {
      this.jsonforms.core = this.middleware(
        this.jsonforms.core as JsonFormsCore,
        Actions.updateCore(
          this.dataToUse,
          this.schemaToUse,
          this.uischemaToUse,
          {
            validationMode: this.validationMode,
            ajv: this.ajv,
            additionalErrors: this.additionalErrors,
          }
        ),
        coreReducer
      );
    },
    eventToEmit(newEvent) {
      // update the data so if we change the additionalErrors this won't reset the form data
      this.dataToUse = newEvent.data;

      this.$emit('change', newEvent);
    },
    i18n: {
      handler(newI18n) {
        this.jsonforms.i18n = i18nReducer(
          this.jsonforms.i18n,
          Actions.updateI18n(
            newI18n?.locale,
            newI18n?.translate,
            newI18n?.translateError
          )
        );
      },
      deep: true,
    },
  },
  mounted() {
    // emit an inital change so clients can react to error validation and default data insertion
    this.$emit('change', {
      data: this.jsonforms.core.data,
      errors: this.jsonforms.core.errors,
    });
  },
  methods: {
    dispatch(action: CoreActions) {
      this.jsonforms.core = this.middleware(
        this.jsonforms.core as JsonFormsCore,
        action,
        coreReducer
      );
    },
  },
});
</script>
