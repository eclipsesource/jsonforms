<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="oneOf"
      :path="path"
      :rootSchema="control.rootSchema"
    />

    <v-tabs
      v-model="selectIndex"
      @update:model-value="handleTabChange"
      :disabled="!control.enabled"
    >
      <v-tab
        v-for="(oneOfRenderInfo, oneOfIndex) in oneOfRenderInfos"
        :key="`${control.path}-${oneOfIndex}`"
      >
        {{ oneOfRenderInfo.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="selectedIndex">
      <v-window-item
        v-for="(oneOfRenderInfo, oneOfIndex) in oneOfRenderInfos"
        :key="`${control.path}-${oneOfIndex}`"
      >
        <dispatch-renderer
          v-if="selectedIndex === oneOfIndex"
          :schema="oneOfRenderInfo.schema"
          :uischema="oneOfRenderInfo.uischema"
          :path="control.path"
          :renderers="control.renderers"
          :cells="control.cells"
          :enabled="control.enabled"
        />
      </v-window-item>
    </v-window>

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

          <v-btn variant="text" @click="cancel">
            {{ control.translations.clearDialogDecline }}
          </v-btn>
          <v-btn variant="text" ref="confirm" @click="confirm">
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
  VSpacer,
  VTab,
  VTabs,
  VWindow,
  VWindowItem,
} from 'vuetify/components';
import { useCombinatorTranslations, useVuetifyControl } from '../util';
import { CombinatorProperties } from './components';

const controlRenderer = defineComponent({
  name: 'one-of-renderer',
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
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsOneOfControl(props);
    const control = input.control.value;

    const selectedIndex = ref(control.indexOfFittingSchema || 0);
    const selectIndex = ref(selectedIndex.value);
    const newSelectedIndex = ref(0);
    const dialog = ref(false);

    return {
      ...useCombinatorTranslations(useVuetifyControl(input)),
      selectedIndex,
      selectIndex,
      dialog,
      newSelectedIndex,
    };
  },
  computed: {
    oneOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.oneOf!,
        this.control.rootSchema,
        'oneOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas,
      );
      return result.filter((info) => info.uischema);
    },
  },
  methods: {
    handleTabChange(): void {
      this.newSelectedIndex = this.selectIndex;
      // revert back to the orginal value until the dialog is done
      this.selectIndex = this.selectedIndex;

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
    openNewTab(newIndex: number): void {
      this.handleChange(
        this.control.path,
        createDefaultValue(
          this.oneOfRenderInfos[newIndex].schema,
          this.control.rootSchema,
        ),
      );
      this.selectIndex = newIndex;
      this.selectedIndex = newIndex;
    },
  },
});

export default controlRenderer;
</script>
