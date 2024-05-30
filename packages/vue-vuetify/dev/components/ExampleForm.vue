<script setup lang="ts">
import type {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  ValidationMode,
} from '@jsonforms/core';
import { JsonForms, type JsonFormsChangeEvent } from '@jsonforms/vue';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import * as JsonRefs from 'json-refs';
import { onMounted, reactive, watch } from 'vue';
import type { ExampleDescription } from '../../../examples/lib';

export type ResolvedSchema = {
  schema?: JsonSchema;
  resolved: boolean;
  error?: string;
};

const props = withDefaults(
  defineProps<{
    example: ExampleDescription;
    renderers: readonly JsonFormsRendererRegistryEntry[];
    config?: any;
    readonly: boolean;
    validationMode: ValidationMode;
    ajv?: Ajv;
    locale: string;
  }>(),
  {
    readonly: false,
    validationMode: 'ValidateAndShow',
    locale: 'en',
  },
);

const resolvedSchema = reactive<ResolvedSchema>({
  schema: undefined,
  resolved: false,
  error: undefined,
});

// const i18n = reactive<JsonFormsI18nState>({
//   locale: props.locale,
//   translate: createTranslator(props.locale, props.example?.i18n),
// });

const additionalErrors: ErrorObject[] = [];

const emits = defineEmits(['jsfchange']);

const onChange = (event: JsonFormsChangeEvent): void => {
  emits('jsfchange', event);
};

watch(
  () => props.example,
  (newExample) => {
    resolveSchema(newExample.schema);
    //i18n.translate = createTranslator(props.locale, newExample?.i18n as any);
  },
);

// watch(
//   () => props.locale,
//   (newLocale) => {
//     i18n.locale = newLocale;
//     i18n.translate = createTranslator(
//       newLocale,
//       props.example?.i18n as any,
//     );
//   },
// );

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
  resolveSchema(props.example.schema);
});
</script>

<template>
  <div>
    <json-forms
      v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
      :key="example.name"
      :data="example.data"
      :schema="resolvedSchema.schema"
      :uischema="example.uischema"
      :renderers="renderers"
      :config="config"
      :validationMode="validationMode"
      :ajv="ajv"
      :readonly="readonly"
      :i18n="example.i18n"
      :additional-errors="additionalErrors"
      :locale="locale"
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
