<template>
  <div>
    <json-forms
      v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
      :data="example.input.data"
      :schema="resolvedSchema.schema"
      :uischema="example.input.uischema"
      :renderers="renderers"
      :cells="cells"
      :config="config"
      :uischemas="uischemas"
      :validationMode="validationMode"
      :ajv="ajv"
      :readonly="readonly"
      :i18n="i18n"
      @change="onChange"
    />
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

<script lang="ts">
import { PropType } from 'vue';
import { Example, ResolvedSchema } from '@/core/types';
import { Ajv } from 'ajv';
import {
  ValidationMode,
  JsonFormsUISchemaRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
  JsonSchema,
  JsonFormsI18nState,
} from '@jsonforms/core';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import JsonRefs from 'json-refs';
import { createTranslator } from '../i18n';

export default {
  name: 'demo-form',
  components: {
    JsonForms,
  },
  props: {
    example: { type: Object as PropType<Example>, required: true },
    renderers: {
      required: true,
      type: Array as PropType<JsonFormsRendererRegistryEntry[]>,
    },
    cells: {
      required: false,
      type: Array as PropType<JsonFormsCellRendererRegistryEntry[]>,
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
      type: Array as PropType<JsonFormsUISchemaRegistryEntry[]>,
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
    locale: {
      required: false,
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      resolvedSchema: {
        schema: undefined,
        resolved: false,
        error: undefined,
      } as ResolvedSchema,
      i18n: {
        locale: this.locale,
        translate: createTranslator(this.locale, this.example?.input?.i18n),
      } as JsonFormsI18nState,
    };
  },
  watch: {
    example: {
      deep: true,
      handler(newExample: Example, oldExample: Example): void {
        this.resolveSchema(newExample.input.schema);
        this.i18n.translate = createTranslator(
          this.locale,
          newExample?.input?.i18n as any
        );
      },
    },
    locale(newLocale: string): void {
      console.log('LOCALE SWITCH', newLocale);
      this.i18n.locale = newLocale;
      this.i18n.translate = createTranslator(
        newLocale,
        this.example?.input?.i18n as any
      );
    },
  },
  mounted() {
    this.resolveSchema(this.example.input.schema);
  },
  methods: {
    onChange(event: JsonFormsChangeEvent): void {
      this.$emit('change', event);
    },
    resolveSchema(schema?: JsonSchema): void {
      const resolvedSchema = this.resolvedSchema;
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
          }
        );
      } else {
        // nothing to resolve
        resolvedSchema.resolved = true;
      }
    },
  },
};
</script>
