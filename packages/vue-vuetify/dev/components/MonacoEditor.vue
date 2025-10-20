<script setup lang="ts">
import monaco, { type MonacoApi } from '../core/monaco';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useTheme } from 'vuetify';

const container = ref<null | HTMLElement>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let changeListener: monaco.IDisposable | null = null;
const theme = useTheme();

type DimensionValue =
  | `${number}px`
  | `${number}%`
  | `${number}vw`
  | `${number}vh`
  | `${number}vmin`
  | `${number}vmax`
  | 'auto'
  | 'fit-content'
  | 'inherit'
  | 'initial'
  | 'unset';

const props = withDefaults(
  defineProps<{
    modelValue?: monaco.editor.ITextModel | string;
    language?: string;
    height?: DimensionValue;
    width?: DimensionValue;
    editorBeforeMount?: (api: MonacoApi) => void;
  }>(),
  {
    height: '100%',
    width: '100%',
  },
);
const emits = defineEmits(['update:modelValue']);
const style = computed(() => ({
  height: props.height,
  width: props.width,
}));
watch(style, () => {
  if (editor) {
    nextTick(() => editor?.layout());
  }
});

watch(
  () => theme.current.value.dark,
  () => {
    if (editor) {
      editor.updateOptions({
        theme: theme.current.value.dark ? 'vs-dark' : 'vs',
      });
    }
  },
);

const resizeObserver = new ResizeObserver(() => {
  nextTick(() => {
    editor?.layout();
  });
});

onMounted(() => {
  props.editorBeforeMount?.(monaco);
  editor = monaco.editor.create(container.value!, {
    value: typeof props.modelValue === 'string' ? props.modelValue : undefined,
    model: typeof props.modelValue !== 'string' ? props.modelValue : undefined,
    theme: theme.current.value.dark ? 'vs-dark' : 'vs',
    language: props.language,
  });
  changeListener = editor.onDidChangeModelContent(() => {
    if (typeof props.modelValue === 'string') {
      emits('update:modelValue', editor!.getValue());
    } else {
      emits('update:modelValue', editor!.getModel());
    }
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (typeof newValue === 'string') {
        if (editor && newValue !== editor.getValue()) {
          editor.setValue(newValue || '');
        }
      } else {
        if (editor && newValue !== editor.getModel()) {
          editor.setModel(newValue ?? null);
        }
      }
    },
  );
  watch(
    () => props.language,
    (language, prev) => {
      if (editor && language !== prev && language) {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      }
    },
  );

  nextTick(() => {
    editor?.layout();
    editor?.getAction('editor.action.formatDocument')?.run();
  });

  resizeObserver.observe(container.value!);
});

onBeforeUnmount(() => {
  if (changeListener) {
    changeListener.dispose();
  }
  if (editor) {
    editor.getModel()?.dispose();
    editor.dispose();
  }
  resizeObserver.disconnect();
});
</script>

<template>
  <div ref="container" :style="style"></div>
</template>
