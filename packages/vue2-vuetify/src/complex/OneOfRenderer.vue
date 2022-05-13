<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="oneOf"
      :path="path"
    />

    <v-tabs v-model="tabIndex">
      <v-tab
        @change="handleTabChange"
        v-for="(oneOfRenderInfo, oneOfIndex) in oneOfRenderInfos"
        :key="`${control.path}-${oneOfIndex}`"
      >
        {{ oneOfRenderInfo.label }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedIndex">
      <v-tab-item
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
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="dialog" persistent max-width="600" @keydown.esc="cancel">
      <v-card>
        <v-card-title class="text-h5"> Clear form? </v-card-title>

        <v-card-text>
          Your data will be cleared if you navigate away from this tab. Do you
          want to proceed?
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
  ControlElement,
  createCombinatorRenderInfos,
  isOneOfControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
  createDefaultValue,
  CombinatorSubSchemaRenderInfo,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsOneOfControl,
} from '@jsonforms/vue2';
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VSpacer,
  VBtn,
  VTabs,
  VTab,
  VTabsItems,
  VTabItem,
} from 'vuetify/lib';
import { defineComponent, ref } from '../vue';
import { useVuetifyControl } from '../util';
import { CombinatorProperties } from './components';
import isEmpty from 'lodash/isEmpty';
import Vue from 'vue';

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
    VTabsItems,
    VTabItem,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsOneOfControl(props);
    const control = (input.control as any).value as typeof input.control;

    const selectedIndex = ref(control.indexOfFittingSchema || 0);
    const tabIndex = ref(selectedIndex.value);
    const newSelectedIndex = ref(0);
    const dialog = ref(false);

    return {
      ...useVuetifyControl(input),
      selectedIndex,
      tabIndex,
      dialog,
      newSelectedIndex,
    };
  },
  computed: {
    oneOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      return createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.oneOf!,
        this.control.rootSchema,
        'oneOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas
      );
    },
  },
  methods: {
    handleTabChange(): void {
      if (this.control.enabled && !isEmpty(this.control.data)) {
        this.dialog = true;
        this.$nextTick(() => {
          this.newSelectedIndex = this.tabIndex;
          // revert the selection while the dialog is open
          this.tabIndex = this.selectedIndex;
        });
        // this.$nextTick does not work so use setTimeout
        setTimeout(() =>
          ((this.$refs.confirm as Vue).$el as HTMLElement).focus()
        );
      } else {
        this.$nextTick(() => {
          this.selectedIndex = this.tabIndex;
        });
      }
    },
    confirm(_event: Event): void {
      this.openNewTab();
      this.dialog = false;
    },
    cancel(_event: Event): void {
      this.newSelectedIndex = this.selectedIndex;
      this.dialog = false;
    },
    openNewTab(): void {
      this.handleChange(
        this.path,
        createDefaultValue(this.oneOfRenderInfos[this.newSelectedIndex].schema)
      );
      this.tabIndex = this.newSelectedIndex;
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
