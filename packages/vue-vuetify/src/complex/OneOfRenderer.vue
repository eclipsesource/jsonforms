<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="oneOf"
      :path="path"
      :rootSchema="control.rootSchema"
    />

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
      :clearable="control.enabled"
      :items="oneOfRenderInfos"
      @update:model-value="handleSelectChange"
      :item-title="
        (item: CombinatorSubSchemaRenderInfo) => t(item.label, item.label)
      "
      item-value="index"
      :model-value="selectedIndex"
      v-bind="vuetifyProps('v-select')"
      @focus="handleFocus"
      @blur="handleBlur"
    ></v-select>
    <dispatch-renderer
      v-if="selectedIndex !== undefined && selectedIndex !== null"
      :schema="oneOfRenderInfos[selectedIndex].schema"
      :uischema="oneOfRenderInfos[selectedIndex].uischema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
      :enabled="control.enabled"
    />

    <v-dialog v-model="dialog" persistent max-width="600" @keydown.esc="cancel">
      <v-card>
        <v-card-title class="text-h5">
          {{ control.translations.clearDialogTitle }}
        </v-card-title>

        <v-card-text>
          {{ control.translations.clearDialogMessage }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            @click="cancel"
            data-testid="clear-dialog-decline"
          >
            {{ control.translations.clearDialogDecline }}
          </v-btn>
          <v-btn
            variant="text"
            ref="confirm"
            @click="confirm"
            data-testid="clear-dialog-accept"
          >
            {{ control.translations.clearDialogAccept }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  type CombinatorSubSchemaRenderInfo,
  type ControlElement,
  createCombinatorRenderInfos,
  createDefaultValue,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  type RendererProps,
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
  VSelect,
  VSpacer,
} from 'vuetify/components';
import { DisabledIconFocus } from '../controls/directives';
import {
  useCombinatorTranslations,
  useTranslator,
  useVuetifyControl,
} from '../util';
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

    const selectedIndex = ref(
      control.indexOfFittingSchema != null &&
        control.indexOfFittingSchema != undefined // use the fitting schema if found
        ? control.indexOfFittingSchema
        : !isEmpty(input.control.value.data)
          ? 0 // uses the first schema and report errors if not empty
          : null,
    );

    const newSelectedIndex = ref<number | null>(null);
    const dialog = ref(false);
    const t = useTranslator();

    return {
      ...useCombinatorTranslations(useVuetifyControl(input)),
      selectedIndex,
      dialog,
      newSelectedIndex,
      t,
    };
  },
  computed: {
    oneOfRenderInfos(): (CombinatorSubSchemaRenderInfo & {
      index: number;
    })[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.oneOf!,
        this.control.rootSchema,
        'oneOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas,
      );

      return result.map((info, index) => ({ ...info, index: index }));
    },
  },
  methods: {
    handleSelectChange(selectIndex: number | null): void {
      this.newSelectedIndex = selectIndex;

      if (isEmpty(this.control.data)) {
        this.openNewTab(this.newSelectedIndex);
      } else {
        this.dialog = true;
        this.$nextTick(() => {
          // cast to 'any' instead of 'Vue' because of Typescript problems (excessive stack depth when comparing types) during rollup build
          ((this.$refs.confirm as any).$el as HTMLElement).focus();
        });
      }
    },
    confirm(): void {
      this.openNewTab(this.newSelectedIndex);
      this.dialog = false;
    },
    cancel(): void {
      this.dialog = false;
    },
    openNewTab(newIndex: number | null): void {
      this.handleChange(
        this.control.path,
        newIndex != null
          ? createDefaultValue(
              this.oneOfRenderInfos[newIndex].schema,
              this.control.rootSchema,
            )
          : undefined,
      );

      this.selectedIndex = newIndex;
    },
  },
});

export default controlRenderer;
</script>
