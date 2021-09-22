<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
      :clipped-left="!$vuetify.rtl"
      :clipped-right="$vuetify.rtl"
      :right="$vuetify.rtl"
    >
      <v-list-item>
        <v-list-item-icon>
          <v-img
            :src="require('./assets/vuetify.svg')"
            max-height="64"
            max-width="64"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Examples </v-list-item-title>
          <v-list-item-subtitle> Vuetify Renderers </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="(example, index) in examples"
          :key="example.title"
          link
        >
          <v-list-item-content @click="selectExample(index)">
            <v-list-item-title>{{ example.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>
        <v-container fill-height fluid
          ><v-row align="center" justify="center">
            <v-col>
              <v-img
                :src="require('./assets/jsonforms.svg')"
                max-height="64"
                max-width="64"
              />
            </v-col>
            <v-col>JSON Forms </v-col>
          </v-row></v-container
        ></v-toolbar-title
      >

      <v-spacer expand></v-spacer>

      <v-toolbar-items>
        <v-container fill-height fluid justify-end
          ><v-row dense>
            <v-col
              ><settings
                :validationMode="validationMode"
                :hideRequiredAsterisk="config.hideRequiredAsterisk"
                :showUnfocusedDescription="config.showUnfocusedDescription"
                :restrict="config.restrict"
                :readonly="readonly"
                @validation-changed="
                  (validation) => (this.validationMode = validation)
                "
                @hide-required-asterisk-changed="
                  (value) => (this.config.hideRequiredAsterisk = value)
                "
                @show-unfocused-description-changed="
                  (value) => (this.config.showUnfocusedDescription = value)
                "
                @readonly-changed="(value) => (this.readonly = value)"
                @restrict-changed="(value) => (this.config.restrict = value)"
              />
            </v-col>
            <v-col><theme-changer /> </v-col>
          </v-row>
        </v-container>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid v-if="example === null">
        <v-row>
          <v-col cols="12">
            <v-img
              :src="require('./assets/logo.svg')"
              class="my-3"
              contain
              height="200"
            />
          </v-col>

          <v-col cols="12" class="text-center">
            <h1 class="display-2 font-weight-bold mb-3">
              Welcome to JSON Forms Vue 2 Vuetify
            </h1>

            <p class="subheading font-weight-regular">
              For help and collaboration with other JSON Forms developers,
              <br />please join our online
              <a href="https://jsonforms.discourse.group" target="_blank"
                >Discourse Community</a
              >
            </p>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid class="demo" v-if="example != null">
        <v-flex>
          <v-card>
            <v-card-title>{{ example.title }}</v-card-title>
            <v-card-text>
              <v-tabs v-model="activeTab">
                <v-tab :key="0">Demo</v-tab>
                <v-spacer expand />
                <v-tab :key="1">Schema</v-tab>
                <v-tab :key="2">UI Schema</v-tab>
                <v-tab :key="3">Data</v-tab>

                <v-tab-item :key="0">
                  <json-forms
                    :data="example.data"
                    :schema="example.schema"
                    :uischema="example.uischema"
                    :renderers="renderers"
                    :cells="cells"
                    :config="config"
                    :validationMode="validationMode"
                    :ajv="handleDefaultsAjv"
                    :readonly="readonly"
                    @change="onChange"
                  />
                </v-tab-item>
                <v-tab-item :key="1">
                  <v-card>
                    <v-card-title>Schema</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      :language="`json`"
                      v-model="monacoSchema"
                      @change="onChangeEditSchema"
                      :editorBeforeMount="registerJsonSchemaValidation"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="2">
                  <v-card>
                    <v-card-title>UI Schema</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoUISchema"
                      @change="onChangeEditUISchema"
                      :editorBeforeMount="registerUISchemaValidation"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
                <v-tab-item :key="3">
                  <v-card>
                    <v-card-title>Data</v-card-title>
                    <v-divider class="mx-4"></v-divider>
                    <monaco-editor
                      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                      height="500"
                      language="json"
                      v-model="monacoData"
                      @change="onChangeEditData"
                      :editorBeforeMount="registerDataValidaton"
                    ></monaco-editor>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';
import { ErrorObject } from 'ajv';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import {
  createAjv,
  extendedVuetifyRenderers,
  mergeStyles,
  defaultStyles,
} from '@jsonforms/vue2-vuetify';
import ajvErrorsPlugin from 'ajv-errors';

import { examples } from './components/examples';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import {
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  configureDataValidation,
  EditorApi,
} from './core/jsonSchemaValidation';

import ThemeChanger from './components/ThemeChanger.vue';
import Settings from './components/Settings.vue';
import MonacoEditor from './components/MonacoEditor.vue';
import { jsonSchemaDraft7, uiSchema } from './core/jsonschema';

const ajv = createAjv({ useDefaults: true });
ajvErrorsPlugin(ajv);

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

const renderers = Object.freeze(extendedVuetifyRenderers);

type JsonInput = {
  schemaId: string;
  title: string;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  data: Record<string, any>;
} | null;

export default defineComponent({
  name: 'app',
  components: {
    JsonForms,
    MonacoEditor,
    ThemeChanger,
    Settings,
  },
  data() {
    const selectedExample = ref(-1);
    const data = ref({});
    const errors: Ref<ErrorObject[] | undefined> = ref(undefined);

    return {
      readonly: false,
      validationMode: 'ValidateAndShow',
      activeTab: 0,
      renderers: renderers,
      cells: renderers,
      handleDefaultsAjv: ajv,
      config: {
        restrict: true,
        trim: false,
        showUnfocusedDescription: false,
        hideRequiredAsterisk: true,
      },
      selectedExample,
      data,
      errors,
      examples,
      monacoOptions: {
        ...monaco.languages.json.jsonDefaults,
      },
    };
  },
  methods: {
    onValidationChange(validation: string) {
      this.validationMode = validation;
    },
    onChange(event: JsonFormsChangeEvent) {
      this.data.value = event.data;
      this.errors.value = event.errors;

      console.log('JsonForm data change: ' + JSON.stringify(this.data.value));
    },
    selectExample(index: number) {
      this.selectedExample.value = index;
    },
    onChangeEditSchema() {
      console.log('on change schema');
    },
    onChangeEditUISchema() {
      console.log('on change ui schema');
    },
    onChangeEditData() {
      console.log('on change data');
    },
    registerJsonSchemaValidation(editor: EditorApi) {
      const modelUri = monaco.Uri.parse(
        'json://core/specification/schema.json'
      );
      configureJsonSchemaValidation(editor, modelUri);
    },
    registerUISchemaValidation(editor: EditorApi) {
      const modelUri = monaco.Uri.parse(
        'json://core/specification/uischema.json'
      );
      configureUISchemaValidation(editor, modelUri);
    },
    registerDataValidaton(editor: EditorApi) {
      const example = this.example;
      if (example && example.schema) {
        if (!Object.prototype.hasOwnProperty.call(example.schema, '$schema')) {
          example.schema['$schema'] = jsonSchemaDraft7.uri;
        }
        if (!Object.prototype.hasOwnProperty.call(example.schema, '$id')) {
          (example.schema as any)['$id'] = example.schemaId;
        }

        configureDataValidation(editor, {
          uri: (example.schema as any)['$id'],
          schema: example.schema,
        });
      }
    },
  },
  computed: {
    example(): JsonInput {
      const e = this.examples[this.selectedExample.value];
      if (e) {
        return {
          schemaId: 'example-' + this.selectedExample.value + '-schema.json',
          title: e.title,
          schema: e.input.schema,
          uischema: e.input.uischema,
          data: e.input.data,
        };
      }

      return null;
    },
    monacoSchema: {
      get(comp) {
        let schema = undefined;
        if (comp.example && comp.example.schema) {
          schema = comp.example.schema;
        }
        if (
          schema &&
          !Object.prototype.hasOwnProperty.call(schema, '$schema')
        ) {
          schema['$schema'] = jsonSchemaDraft7.uri;
        }
        if (schema && !Object.prototype.hasOwnProperty.call(schema, '$id')) {
          schema['$id'] = comp.example.schemaId;
        }

        return schema ? JSON.stringify(schema, null, 2) : '';
      },

      set(_: string) {
        console.log('on change schema');
      },
    },
    monacoUISchema: {
      get(comp) {
        let uischema = undefined;
        if (comp.example && comp.example.uischema) {
          uischema = comp.example.uischema;
        }
        if (
          uischema &&
          !Object.prototype.hasOwnProperty.call(uischema, '$schema')
        ) {
          uischema['$schema'] = uiSchema.uri;
        }
        return uischema ? JSON.stringify(uischema, null, 2) : '';
      },

      set(_: string) {
        console.log('on change ui schema');
      },
    },
    monacoData: {
      cache: false,
      get(comp) {
        let data = undefined;
        if (comp.data.value) {
          data = comp.data.value;
        }
        if (data && !Object.prototype.hasOwnProperty.call(data, '$schema')) {
          if (
            comp.example.schema &&
            Object.prototype.hasOwnProperty.call(comp.example.schema, '$id')
          ) {
            data['$schema'] = comp.example.schema.$id;
          }
        }

        return data ? JSON.stringify(data, null, 2) : '';
      },

      set(_: string) {
        console.log('on change data');
      },
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style scoped>
.form {
  max-width: 500px;
  flex: 1;
}
.container {
  display: flex;
}
.data {
  flex: 1;
}

.demo {
  max-width: 900px;
}
</style>

<style>
/* required class */
.code-editor {
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.vue-code-hightlight pre {
  background-color: transparent !important;
}

.vue-code-hightlight pre code {
  background-color: transparent !important;
}
</style>
