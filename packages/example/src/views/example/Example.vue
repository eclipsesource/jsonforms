<template>
  <div>
    <v-container fluid class="demo" v-if="example != null && !formonly">
      <v-flex>
        <v-card>
          <v-card-title>{{ example.title }}</v-card-title>
          <v-card-text>
            <v-tabs v-model="activeTab">
              <v-tab :key="0"
                >Demo<validation-icon
                  v-if="errors"
                  :errors="errors"
                ></validation-icon
              ></v-tab>
              <v-spacer expand />
              <v-tab :key="1">Schema</v-tab>
              <v-tab :key="2">UI Schema</v-tab>
              <v-tab :key="3">Data</v-tab>
              <v-tab :key="4">Internationalization</v-tab>
              <v-tab-item :key="0">
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>JSONForm</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            v-on="onTooltip"
                            :to="{
                              name: 'example',
                              params: { id: $route.params.id },
                              query: { view: 'form-only' },
                            }"
                          >
                            <v-icon>mdi-dock-window</v-icon>
                          </v-btn>
                        </template>
                        {{ `Show JsonForm Only` }}
                      </v-tooltip>
                    </v-toolbar>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <div class="json-forms">
                    <demo-form
                      :example="example"
                      :renderers="allRenderers"
                      :cells="cells"
                      :config="config"
                      :validationMode="validationMode"
                      :ajv="ajv"
                      :readonly="readonly"
                      :locale="locale"
                      @change="onChange"
                    />
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="1">
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>Schema</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="reloadMonacoSchema"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-reload</v-icon>
                          </v-btn>
                        </template>
                        {{ `Reload Example Schema` }}
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="saveMonacoSchema"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </template>
                        {{ `Apply Change To Example Schema` }}
                      </v-tooltip>
                    </v-toolbar>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <monaco-editor
                    :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                    height="500"
                    :language="`json`"
                    v-model="monacoSchemaModel"
                    :editorBeforeMount="registerValidations"
                  ></monaco-editor>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="2">
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>UI Schema</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="reloadMonacoUiSchema"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-reload</v-icon>
                          </v-btn>
                        </template>
                        {{ `Reload Example UI Schema` }}
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="saveMonacoUiSchema"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </template>
                        {{ `Apply Change To Example UI Schema` }}
                      </v-tooltip>
                    </v-toolbar>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <monaco-editor
                    :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                    height="500"
                    language="json"
                    v-model="monacoUiSchemaModel"
                    :editorBeforeMount="registerValidations"
                  ></monaco-editor>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="3">
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>Data</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="reloadMonacoData"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-reload</v-icon>
                          </v-btn>
                        </template>
                        {{ `Reload Example Data` }}
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn icon @click="saveMonacoData" v-on="onTooltip">
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </template>
                        {{ `Apply Change To Example Data` }}
                      </v-tooltip>
                    </v-toolbar>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <monaco-editor
                    :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                    height="500"
                    language="json"
                    v-model="monacoDataModel"
                    :editorBeforeMount="registerValidations"
                  ></monaco-editor>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="4">
                <v-card>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-toolbar-title>Internationalization</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn
                            icon
                            @click="reloadMonacoI18N"
                            v-on="onTooltip"
                          >
                            <v-icon>mdi-reload</v-icon>
                          </v-btn>
                        </template>
                        {{ `Reload Example Internationalization` }}
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: onTooltip }">
                          <v-btn icon @click="saveMonacoI18N" v-on="onTooltip">
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </template>
                        {{ `Apply Change To Example Data` }}
                      </v-tooltip>
                    </v-toolbar>
                  </v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <monaco-editor
                    :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                    height="500"
                    language="json"
                    v-model="monacoI18NModel"
                    :editorBeforeMount="registerValidations"
                  ></monaco-editor>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
          {{ snackbarText }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </v-flex>
    </v-container>
    <div class="json-forms">
      <demo-form
        v-if="example != null && formonly"
        :example="example"
        :renderers="allRenderers"
        :cells="cells"
        :config="config"
        :validationMode="validationMode"
        :ajv="ajv"
        :readonly="readonly"
        :locale="locale"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { examples } from '@/examples';
import { find } from 'lodash';
import { sync } from 'vuex-pathify';

import DemoForm from '@/components/DemoForm.vue';
import MonacoEditor from '@/components/MonacoEditor.vue';
import {
  configureDataValidation,
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  EditorApi,
  getMonacoModelForUri,
} from '@/core/jsonSchemaValidation';
import { Example } from '@/core/types';
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { JsonFormsChangeEvent } from '@jsonforms/vue2';
import {
  defaultStyles,
  mergeStyles,
  ValidationIcon,
} from '@jsonforms/vue2-vuetify';
import { ErrorObject } from 'ajv';
import cloneDeep from 'lodash/cloneDeep';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

export default {
  name: 'ExampleView',
  components: {
    MonacoEditor,
    DemoForm,
    ValidationIcon,
  },
  data() {
    return {
      activeTab: 0,
      examples,
      example: undefined,
      errors: undefined as
        | ErrorObject<string, Record<string, any>, unknown>[]
        | undefined,
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 3000,
    };
  },
  computed: {
    renderers: sync('app/jsonforms@renderers'),
    allRenderers(): JsonFormsRendererRegistryEntry[] {
      return (this.example?.input.renderers ?? []).concat(this.renderers);
    },
    cells: sync('app/jsonforms@cells'),
    config: sync('app/jsonforms@config'),
    validationMode: sync('app/jsonforms@validationMode'),
    ajv: sync('app/jsonforms@ajv'),
    readonly: sync('app/jsonforms@readonly'),
    monacoSchemaModel: sync('app/monaco@schemaModel'),
    monacoUiSchemaModel: sync('app/monaco@uischemaModel'),
    monacoDataModel: sync('app/monaco@dataModel'),
    monacoI18NModel: sync('app/monaco@i18nModel'),
    locale: sync('app/jsonforms@locale'),
    formonly(): boolean {
      return this.$route.query?.view === 'form-only';
    },
  },
  mounted() {
    this.setExample(
      find(this.examples, (example) => example.id === this.$route.params.id)
    );
  },
  watch: {
    '$route.params.id'(id) {
      this.setExample(find(this.examples, (example) => example.id === id));
    },
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.$store.set(
        'app/monaco@dataModel',
        getMonacoModelForUri(
          monaco.Uri.parse(this.toDataUri(this.example.id)),
          event.data ? JSON.stringify(event.data, null, 2) : ''
        )
      );
      this.errors = event.errors;
    },
    setExample(example: Example): void {
      if (example) {
        this.example = cloneDeep(example);
        this.updateMonacoModels(this.example);
      }
    },
    reloadMonacoSchema() {
      const example = find(
        this.examples,
        (example) => example.id === this.$route.params.id
      );

      if (example) {
        this.$store.set(
          'app/monaco@schemaModel',
          getMonacoModelForUri(
            monaco.Uri.parse(this.toSchemaUri(example.id)),
            example.input.schema
              ? JSON.stringify(example.input.schema, null, 2)
              : ''
          )
        );
        this.toast('Original example schema loaded. Apply it to take effect.');
      }
    },
    saveMonacoSchema() {
      const model = this.monacoSchemaModel as monaco.editor.ITextModel;
      const example = this.example;

      if (model && example) {
        // TODO: is there a better way how to get errors including the error message from monaco editor ?
        const hasError =
          model
            .getAllDecorations()
            .filter((d) => d.options.className === 'squiggly-error')
            .map((e) => e).length > 0;

        const modelValue = model.getValue().trim();
        if (!hasError) {
          const newJson: Record<string, any> = modelValue
            ? JSON.parse(modelValue)
            : undefined;
          this.$set(example.input, 'schema', newJson);
          this.toast('New schema applied');
        } else if (hasError) {
          this.toast('Error: schema is invalid');
        }
      }
    },
    reloadMonacoUiSchema() {
      const example = find(
        this.examples,
        (example) => example.id === this.$route.params.id
      );

      if (example) {
        this.$store.set(
          'app/monaco@uischemaModel',
          getMonacoModelForUri(
            monaco.Uri.parse(this.toUiSchemaUri(example.id)),
            example.input.uischema
              ? JSON.stringify(example.input.uischema, null, 2)
              : ''
          )
        );
        this.toast(
          'Original example UI schema loaded. Apply it to take effect.'
        );
      }
    },
    saveMonacoUiSchema() {
      const model = this.monacoUiSchemaModel as monaco.editor.ITextModel;
      const example = this.example;

      if (model && example) {
        // TODO: is there a better way how to get errors including the error message from monaco editor ?
        const hasError =
          model
            .getAllDecorations()
            .filter((d) => d.options.className === 'squiggly-error')
            .map((e) => e).length > 0;

        const modelValue = model.getValue().trim();
        if (!hasError) {
          const newJson: Record<string, any> = modelValue
            ? JSON.parse(modelValue)
            : undefined;

          this.$set(example.input, 'uischema', newJson);
          this.toast('New UI schema applied');
        } else if (hasError) {
          this.toast('Error: UI schema is invalid');
        }
      }
    },
    reloadMonacoData() {
      const example = find(
        this.examples,
        (example) => example.id === this.$route.params.id
      );

      if (example) {
        this.$store.set(
          'app/monaco@dataModel',
          getMonacoModelForUri(
            monaco.Uri.parse(this.toDataUri(example.id)),
            example.input.data
              ? JSON.stringify(example.input.data, null, 2)
              : ''
          )
        );
        this.toast('Original example data loaded. Apply it to take effect.');
      }
    },
    saveMonacoData() {
      const model = this.monacoDataModel as monaco.editor.ITextModel;
      const example = this.example;

      if (model && example) {
        // do not check for monaco errors just if this is valid JSON becase we want to see when we have validation errors

        const modelValue = model.getValue().trim();
        if (modelValue) {
          let newJson: Record<string, any> | undefined = undefined;

          try {
            newJson = JSON.parse(modelValue);
          } catch (error) {
            this.toast(`Error: ${error}`);
          }

          if (newJson) {
            this.$set(example.input, 'data', newJson);
            this.toast('New data applied');
          }
        }
      }
    },
    reloadMonacoI18N() {
      const example = find(
        this.examples,
        (example) => example.id === this.$route.params.id
      );

      if (example) {
        this.$store.set(
          'app/monaco@i18nModel',
          getMonacoModelForUri(
            monaco.Uri.parse(this.toI18NUri(example.id)),
            example.input.i18n
              ? JSON.stringify(example.input.i18n, null, 2)
              : ''
          )
        );
        this.toast('Original example i18n loaded. Apply it to take effect.');
      }
    },
    saveMonacoI18N() {
      const model = this.monacoI18NModel as monaco.editor.ITextModel;
      const example = this.example;

      if (model && example) {
        // TODO: is there a better way how to get errors including the error message from monaco editor ?
        const hasError =
          model
            .getAllDecorations()
            .filter((d) => d.options.className === 'squiggly-error')
            .map((e) => e).length > 0;

        const modelValue = model.getValue().trim();
        if (!hasError) {
          const newJson: Record<string, any>[] = modelValue
            ? JSON.parse(modelValue)
            : undefined;

          this.$set(example.input, 'i18n', newJson);
          this.toast('New i18n applied');
        } else if (hasError) {
          this.toast('Error: i18n is invalid');
        }
      }
    },
    registerValidations(editor: EditorApi) {
      configureJsonSchemaValidation(editor, ['*.schema.json']);
      configureUISchemaValidation(editor, ['*.uischema.json']);
      for (let example of examples) {
        const schema = {
          ...example.input.schema,
          title: example.title,
        };

        if (example && example.input.schema) {
          configureDataValidation(
            editor,
            `inmemory://${this.toSchemaUri(example.id)}`,
            this.toDataUri(example.id),
            schema
          );
        }
      }
    },
    updateMonacoModels(example) {
      this.$store.set(
        'app/monaco@schemaModel',
        getMonacoModelForUri(
          monaco.Uri.parse(this.toSchemaUri(example.id)),
          example.input.schema
            ? JSON.stringify(example.input.schema, null, 2)
            : ''
        )
      );
      this.$store.set(
        'app/monaco@uischemaModel',
        getMonacoModelForUri(
          monaco.Uri.parse(this.toUiSchemaUri(example.id)),
          example.input.uischema
            ? JSON.stringify(example.input.uischema, null, 2)
            : ''
        )
      );
      this.$store.set(
        'app/monaco@dataModel',
        getMonacoModelForUri(
          monaco.Uri.parse(this.toDataUri(example.id)),
          example.input.data ? JSON.stringify(example.input.data, null, 2) : ''
        )
      );
      this.$store.set(
        'app/monaco@i18nModel',
        getMonacoModelForUri(
          monaco.Uri.parse(this.toI18NUri(example.id)),
          example.input.i18n ? JSON.stringify(example.input.i18n, null, 2) : ''
        )
      );
    },
    toSchemaUri(id: string): string {
      return `${id}.schema.json`;
    },
    toUiSchemaUri(id: string): string {
      return `${id}.uischema.json`;
    },
    toDataUri(id: string): string {
      return `${id}.data.json`;
    },
    toI18NUri(id: string): string {
      return `${id}.i18n.json`;
    },
    toast(message: string): void {
      this.snackbar = true;
      this.snackbarText = message;
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
};
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
