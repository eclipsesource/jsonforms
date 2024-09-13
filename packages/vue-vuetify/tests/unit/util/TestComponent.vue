<template>
  <v-app>
    <json-forms
      :data="data"
      :schema="schema"
      :uischema="uischema"
      :renderers="renderers"
      :config="config"
      :i18n="i18n"
      @change="onChange"
    />
  </v-app>
</template>

<script lang="ts">
import {
  defaultMiddleware,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsI18nState,
  type JsonFormsRendererRegistryEntry,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type Middleware,
  type UISchemaElement,
  type ValidationMode,
} from '@jsonforms/core';
import {
  JsonForms,
  type JsonFormsChangeEvent,
  type MaybeReadonly,
} from '@jsonforms/vue';
import Ajv, { type ErrorObject } from 'ajv';
import { defineComponent, reactive, type PropType } from 'vue';
import { VApp } from 'vuetify/components';

const EMPTY: ErrorObject[] = reactive([]);

export default defineComponent({
  name: 'test-component',
  components: {
    JsonForms,
    VApp,
  },
  props: {
    data: {
      required: true,
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
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
  data() {
    return {
      event: {} as JsonFormsChangeEvent,
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.event = event;
    },
  },
});
</script>
