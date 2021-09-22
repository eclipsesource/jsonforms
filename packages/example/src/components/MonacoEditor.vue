<template>
  <div
    ref="containerElement"
    :style="style"
    className="vue-monaco-editor-container"
  />
</template>

<script lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { PropType } from 'vue';

export type MonacoApi = typeof monaco;

export { monaco };

function processSize(size: number | string) {
  return !/^\d+$/.test(size as string) ? size : `${size}px`;
}

interface BaseComponentData {
  editor?: monaco.editor.IStandaloneCodeEditor;
  subscription?: monaco.IDisposable;
  prevent_trigger_change_event?: boolean;
}

export default {
  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    value: String,
    defaultValue: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    theme: { type: String, default: 'vs' },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    overrideServices: {
      type: Object,
      default() {
        return {};
      },
    },
    editorMounted: {
      type: Function as PropType<
        (editor: monaco.editor.IStandaloneCodeEditor, api: MonacoApi) => void
      >,
      default: (
        _editor: monaco.editor.IStandaloneCodeEditor,
        _api: MonacoApi
      ) => undefined,
    },
    editorBeforeMount: {
      type: Function as PropType<(api: MonacoApi) => Record<string, any>>,
      default: (_api: MonacoApi) => undefined,
    },
    className: { type: String, required: false },
  },
  data(): BaseComponentData {
    return {
      editor: undefined,
      subscription: undefined,
      prevent_trigger_change_event: undefined,
    };
  },
  mounted() {
    this.initMonaco();
  },
  watch: {
    options: {
      deep: true,
      handler(options: any, prevOptions: any) {
        if (this.editor && options !== prevOptions) {
          // Don't pass in the model on update because monaco crashes if we pass the model
          // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
          const { model: _model, ...optionsWithoutModel } = options;
          this.editor.updateOptions({
            ...(this.className ? { extraEditorClassName: this.className } : {}),
            ...optionsWithoutModel,
          });
        }
      },
    },
    value(value) {
      if (this.editor) {
        const { editor } = this;
        const model = editor.getModel();
        if (this.value != null && this.value !== model?.getValue()) {
          this.prevent_trigger_change_event = true;
          this.editor.pushUndoStop();
          model?.pushEditOperations(
            [],
            [
              {
                range: model?.getFullModelRange(),
                text: value,
              },
            ],
            () => null
          );
          this.editor.pushUndoStop();
          this.prevent_trigger_change_event = false;
        }
      }
    },
    language(language: string, prev: string) {
      const { editor } = this;
      if (editor && prev !== language) {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      }
    },
    theme(theme: string, prev: string) {
      if (prev !== theme) {
        monaco.editor.setTheme(theme);
      }
    },
    style() {
      const { editor } = this;
      editor &&
        this.$nextTick(() => {
          editor.layout();
        });
    },
  },
  beforeDestroy() {
    this.destroyMonaco();
  },
  computed: {
    style() {
      const { width, height } = this;
      const fixedWidth = processSize(width);
      const fixedHeight = processSize(height);
      return {
        width: fixedWidth,
        height: fixedHeight,
      };
    },
  },
  methods: {
    destroyMonaco() {
      if (this.editor) {
        this.editor.dispose();
        const model = this.editor.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (this.subscription) {
        this.subscription.dispose();
      }
    },

    initMonaco() {
      const value = this.value != null ? this.value : this.defaultValue;
      const { language, theme, overrideServices, className } = this;
      // Before initializing monaco editor
      const options = { ...this.options, ...this.editorWillMount() };
      this.editor = monaco.editor.create(
        this.$refs.containerElement as HTMLElement,
        {
          value,
          language,
          ...(className ? { extraEditorClassName: className } : {}),
          ...options,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      );
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    },

    editorWillMount(): Record<string, any> {
      const options = this.editorBeforeMount(monaco);
      return options || {};
    },

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor): void {
      this.editorMounted(editor, monaco);

      this.subscription = editor.onDidChangeModelContent((event) => {
        if (!this.prevent_trigger_change_event) {
          this.$emit('change', editor.getValue(), event);
        }
      });
    },
  },
};
</script>
