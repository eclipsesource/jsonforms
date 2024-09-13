<template>
  <div v-if="control.visible" :class="styles.oneOf.root">
    <combinator-properties
      :schema="control.schema"
      combinator-keyword="oneOf"
      :path="path"
      :root-schema="control.rootSchema"
    />

    <control-wrapper
      v-bind="controlWrapper"
      :styles="styles"
      :is-focused="isFocused"
      :applied-options="appliedOptions"
    >
      <select
        :id="control.id + '-input'"
        :class="styles.control.select"
        :value="selectIndex"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        @change="handleSelectChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
        <option
          v-for="optionElement in indexedOneOfRenderInfos"
          :key="optionElement.index"
          :value="optionElement.index"
          :label="optionElement.label"
          :class="styles.control.option"
        ></option>
      </select>
    </control-wrapper>

    <dispatch-renderer
      v-if="selectedIndex !== undefined && selectedIndex !== null"
      :schema="indexedOneOfRenderInfos[selectedIndex].schema"
      :uischema="indexedOneOfRenderInfos[selectedIndex].uischema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
      :enabled="control.enabled"
    />

    <dialog ref="dialog" :class="styles.dialog.root">
      <h1 :class="styles.dialog.title">
        {{ translations.clearDialogTitle }}
      </h1>

      <p :class="styles.dialog.body">
        {{ translations.clearDialogMessage }}
      </p>

      <div :class="styles.dialog.actions">
        <button :onclick="onCancel" :class="styles.dialog.buttonSecondary">
          {{ translations.clearDialogDecline }}
        </button>
        <button
          ref="confirm"
          :onclick="onConfirm"
          :class="styles.dialog.buttonPrimary"
        >
          {{ translations.clearDialogAccept }}
        </button>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts">
import {
  combinatorDefaultTranslations,
  CombinatorSubSchemaRenderInfo,
  ControlElement,
  createCombinatorRenderInfos,
  createDefaultValue,
  defaultJsonFormsI18nState,
  getCombinatorTranslations,
  isOneOfControl,
  JsonFormsRendererRegistryEntry,
  JsonFormsSubStates,
  rankWith,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsOneOfControl,
} from '@jsonforms/vue';
import isEmpty from 'lodash/isEmpty';
import { defineComponent, inject, nextTick, ref } from 'vue';
import { useVanillaControl } from '../util';
import { ControlWrapper } from '../controls';
import CombinatorProperties from './components/CombinatorProperties.vue';

const controlRenderer = defineComponent({
  name: 'OneOfRenderer',
  components: {
    ControlWrapper,
    DispatchRenderer,
    CombinatorProperties,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsOneOfControl(props);
    const control = input.control.value;

    const selectedIndex = ref(control.indexOfFittingSchema);
    const selectIndex = ref(selectedIndex.value);
    const newSelectedIndex = ref(0);

    const dialog = ref<HTMLDialogElement>();
    const confirm = ref<HTMLElement>();

    return {
      ...useVanillaControl(input),
      selectedIndex,
      selectIndex,
      newSelectedIndex,
      dialog,
      confirm,
    };
  },
  computed: {
    indexedOneOfRenderInfos(): (CombinatorSubSchemaRenderInfo & {
      index: number;
    })[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.oneOf!,
        this.control.rootSchema,
        'oneOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas
      );

      return result
        .filter((info) => info.uischema)
        .map((info, index) => ({ ...info, index: index }));
    },

    translations(): any {
      const jsonforms = inject<JsonFormsSubStates>('jsonforms');
      return getCombinatorTranslations(
        jsonforms?.i18n?.translate ?? defaultJsonFormsI18nState.translate,
        combinatorDefaultTranslations,
        this.control.i18nKeyPrefix,
        this.control.label
      );
    },
  },
  methods: {
    handleSelectChange(event: Event): void {
      const target = event.target as any;
      this.selectIndex = target.value;

      if (this.control.enabled && !isEmpty(this.control.data)) {
        this.showDialog();
        nextTick(() => {
          this.newSelectedIndex = this.selectIndex;
          // revert the selection while the dialog is open
          this.selectIndex = this.selectedIndex;
          this.confirm?.focus();
        });
      } else {
        nextTick(() => {
          this.selectedIndex = this.selectIndex;
        });
      }
    },
    showDialog(): void {
      this.dialog?.showModal();
    },
    closeDialog(): void {
      this.dialog?.close();
    },
    onConfirm(): void {
      this.newSelection();
      this.closeDialog();
    },
    onCancel(): void {
      this.newSelectedIndex = this.selectedIndex;
      this.closeDialog();
    },
    newSelection(): void {
      this.handleChange(
        this.control.path,
        this.newSelectedIndex !== undefined && this.newSelectedIndex !== null
          ? createDefaultValue(
              this.indexedOneOfRenderInfos[this.newSelectedIndex].schema,
              this.control.rootSchema
            )
          : {}
      );
      this.selectIndex = this.newSelectedIndex;
      this.selectedIndex = this.newSelectedIndex;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(3, isOneOfControl),
};
</script>
