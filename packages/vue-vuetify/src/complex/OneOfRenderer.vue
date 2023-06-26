<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="oneOf"
      :path="path"
    />

    <v-hover v-slot="{ isHovering }">
      <v-select
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="control.errors"
        :clearable="isHovering"
        :items="indexedOneOfRenderInfos"
        @change="handleSelectChange"
        :item-title="(item) => t(item.label, item.label)"
        item-value="index"
        v-model="selectIndex"
        v-bind="vuetifyProps('v-select')"
        @focus="isFocused = true"
        @blur="isFocused = false"
      ></v-select>
    </v-hover>
    <dispatch-renderer
      v-if="selectedIndex !== undefined && selectedIndex !== null"
      :schema="indexedOneOfRenderInfos[selectedIndex].schema"
      :uischema="indexedOneOfRenderInfos[selectedIndex].uischema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
      :enabled="control.enabled"
    />

    <v-dialog v-model="dialog" persistent max-width="600" @keydown.esc="cancel">
      <v-card>
        <v-card-title class="text-h5"> Clear form? </v-card-title>

        <v-card-text>
          Your data will be cleared if you select this new option. Do you want
          to proceed?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="cancel"> No </v-btn>
          <v-btn text ref="confirm" @click="confirm"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  CombinatorSubSchemaRenderInfo,
  ControlElement,
  createCombinatorRenderInfos,
  createDefaultValue,
  isOneOfControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsOneOfControl,
} from '@jsonforms/vue';
import isEmpty from 'lodash/isEmpty';
import { defineComponent, ref } from 'vue';
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDialog,
  VHover,
  VSelect,
  VSpacer,
} from 'vuetify/components';
import { DisabledIconFocus } from '../controls/directives';
import { useTranslator, useVuetifyControl } from '../util';
import { CombinatorProperties } from './components';

const controlRenderer = defineComponent({
  name: 'one-of-select-renderer',
  components: {
    DispatchRenderer,
    CombinatorProperties,
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VSpacer,
    VBtn,
    VSelect,
    VHover,
  },
  directives: {
    DisabledIconFocus,
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
    const dialog = ref(false);
    const t = useTranslator();

    return {
      ...useVuetifyControl(input),
      selectedIndex,
      selectIndex,
      dialog,
      newSelectedIndex,
      t,
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
  },
  methods: {
    handleSelectChange(): void {
      if (this.control.enabled && !isEmpty(this.control.data)) {
        this.dialog = true;
        this.$nextTick(() => {
          this.newSelectedIndex = this.selectIndex;
          // revert the selection while the dialog is open
          this.selectIndex = this.selectedIndex;
        });
        // this.$nextTick does not work so use setTimeout
        setTimeout(() =>
          // cast to 'any' instead of 'Vue' because of Typescript problems (excessive stack depth when comparing types) during rollup build
          ((this.$refs.confirm as any).$el as HTMLElement).focus()
        );
      } else {
        this.$nextTick(() => {
          this.selectedIndex = this.selectIndex;
        });
      }
    },
    confirm(): void {
      this.newSelection();
      this.dialog = false;
    },
    cancel(): void {
      this.newSelectedIndex = this.selectedIndex;
      this.dialog = false;
    },
    newSelection(): void {
      this.handleChange(
        this.path,
        this.newSelectedIndex !== undefined && this.newSelectedIndex !== null
          ? createDefaultValue(
              this.indexedOneOfRenderInfos[this.newSelectedIndex].schema
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
