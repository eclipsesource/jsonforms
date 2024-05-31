<script setup lang="ts">
import type {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsI18nState,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  Middleware,
  UISchemaElement,
  ValidationMode,
} from '@jsonforms/core';
import {
  JsonForms,
  type JsonFormsChangeEvent,
  type MaybeReadonly,
} from '@jsonforms/vue';
import type { Ajv, ErrorObject } from 'ajv';
import * as JsonRefs from 'json-refs';
import { computed, onMounted, reactive, watch } from 'vue';

export type ResolvedSchema = {
  schema?: JsonSchema;
  resolved: boolean;
  error?: string;
};

export interface JsonFormsProps {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  renderers: MaybeReadonly<JsonFormsRendererRegistryEntry[]>;
  cells?: MaybeReadonly<JsonFormsCellRendererRegistryEntry[]>;
  config?: any;
  readonly?: boolean;
  uischemas?: MaybeReadonly<JsonFormsUISchemaRegistryEntry[]>;
  validationMode?: ValidationMode;
  ajv?: Ajv;
  i18n?: JsonFormsI18nState;
  additionalErrors?: ErrorObject<string, Record<string, any>, unknown>[];
  middleware?: Middleware;
}

const props = defineProps<{
  state: JsonFormsProps;
}>();

const resolvedSchema = reactive<ResolvedSchema>({
  schema: undefined,
  resolved: false,
  error: undefined,
});

const emits = defineEmits(['jsfchange']);

const onChange = (event: JsonFormsChangeEvent): void => {
  emits('jsfchange', event);
};

watch(
  () => props.state.schema,
  (schema) => {
    resolveSchema(schema);
  },
);

const resolveSchema = (schema?: JsonSchema): void => {
  resolvedSchema.schema = undefined;
  resolvedSchema.resolved = false;
  resolvedSchema.error = undefined;

  if (schema) {
    JsonRefs.resolveRefs(schema).then(
      function (res) {
        resolvedSchema.schema = res.resolved;
        resolvedSchema.resolved = true;
      },
      function (err: Error) {
        resolvedSchema.resolved = true;
        resolvedSchema.error = err.message;
      },
    );
  } else {
    // nothing to resolve
    resolvedSchema.resolved = true;
  }
};

onMounted(() => {
  resolveSchema(props.state.schema);
});

const properties = computed<JsonFormsProps>(() => ({
  ...props.state,
  schema: resolvedSchema.schema ?? props.state.schema,
}));
</script>

<template>
  <div>
    <json-forms
      v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
      v-bind="properties"
      @change="onChange"
    ></json-forms>
    <v-container v-else>
      <v-row
        v-if="!resolvedSchema.resolved"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col class="text-subtitle-1 text-center" cols="12">
          Resolving Schema Refs
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
      <v-row
        v-else-if="resolvedSchema.error !== undefined"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col class="text-subtitle-1 text-center" cols="12">
          <v-alert color="red" dark>
            {{ resolvedSchema.error }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
