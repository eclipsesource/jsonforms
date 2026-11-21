<template>
  <dispatch-renderer
    :schema="jsonforms.core.schema"
    :uischema="jsonforms.core.uischema"
    :path="''"
  />
</template>

<script lang="ts">
import {
  Actions,
  configReducer,
  CoreActions,
  coreReducer,
  defaultMiddleware,
  Generate,
  i18nReducer,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsI18nState,
  JsonFormsRendererRegistryEntry,
  JsonFormsSubStates,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  Middleware,
  UISchemaElement,
  ValidationMode,
} from '@jsonforms/core';
import isEqual from 'lodash/isEqual';
import {
  defineComponent,
  PropType,
  reactive,
  shallowReactive,
  shallowRef,
  toRaw,
} from 'vue';
import { JsonFormsChangeEvent, MaybeReadonly } from '../types';
import DispatchRenderer from './DispatchRenderer.vue';

import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';

const EMPTY: ErrorObject[] = reactive([]);

const generateUISchema = (schema: JsonSchema) =>
  Generate.uiSchema(schema, undefined, undefined, schema);

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
  emits: ['change', 'update:data'],
  /**
   * The state of a form is shallow.
   *
   * JSON Forms only reads the schema and the UI schema, thus Vue does not need
   * to make them reactive. A deep proxy made a new proxy for each nested schema
   * node at the first read of that node. Testers and the scope resolution read
   * the schema many times for each control, thus these proxies made a large
   * form slow to mount.
   *
   * `toRaw` unwraps a proxy of the data, the schema and the UI schema, thus the
   * form always works on the plain objects. `shallowRef` and `shallowReactive`
   * keep these objects as they are. A reducer replaces `core` for each change
   * and never changes it in place, thus shallow tracking is sufficient.
   */
  data() {
    const dataToUse = toRaw(this.data);
    const schemaToUse: JsonSchema =
      toRaw(this.schema) ?? Generate.jsonSchema(dataToUse);
    const uischemaToUse = toRaw(this.uischema) ?? generateUISchema(schemaToUse);
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
          // Ajv cannot compile a schema through a proxy of itself.
          ajv: toRaw(this.ajv),
          additionalErrors: this.additionalErrors,
        }),
        coreReducer
      );
      return core;
    };
    return {
      schemaToUse: shallowRef(schemaToUse),
      dataToUse: shallowRef(dataToUse),
      uischemaToUse: shallowRef(uischemaToUse),
      jsonforms: shallowReactive({
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
      }),
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
      this.schemaToUse =
        toRaw(newSchema) ?? Generate.jsonSchema(this.dataToUse);
      if (!this.uischema) {
        this.uischemaToUse = generateUISchema(this.schemaToUse);
      }
    },
    uischema(newUischema) {
      this.uischemaToUse =
        toRaw(newUischema) ?? generateUISchema(this.schemaToUse);
    },
    data(newData) {
      const isSameAsCurrentData =
        toRaw(newData) === toRaw(this.jsonforms.core.data);
      this.dataToUse = toRaw(newData);

      if (
        (this.schema === undefined || this.schema === null) &&
        !isSameAsCurrentData
      ) {
        const nextSchema = Generate.jsonSchema(this.dataToUse);
        if (!isEqual(nextSchema, this.schemaToUse)) {
          this.schemaToUse = nextSchema;
          if (!this.uischema) {
            this.uischemaToUse = generateUISchema(this.schemaToUse);
          }
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
            // Ajv cannot compile a schema through a proxy of itself.
            ajv: toRaw(this.ajv),
            additionalErrors: this.additionalErrors,
          }
        ),
        coreReducer
      );
    },
    eventToEmit(newEvent, oldEvent) {
      if (newEvent.data !== oldEvent.data) {
        this.$emit('update:data', newEvent.data);
      }
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
    // emit an initial change so clients can react to error validation and default data insertion
    if (toRaw(this.jsonforms.core.data) !== toRaw(this.data)) {
      this.$emit('update:data', this.jsonforms.core.data);
    }
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
