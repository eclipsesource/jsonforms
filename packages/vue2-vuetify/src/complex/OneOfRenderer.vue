<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="subSchema"
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
  resolveSubSchemas,
  JsonFormsSubStates,
  isInherentlyEnabled,
  getConfig,
  getSchema,
  getData,
  ControlProps,
  JsonSchema,
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
import { computed, defineComponent, inject, ref } from '../vue';
import { useVuetifyControl } from '../util';
import { CombinatorProperties } from './components';
import isEmpty from 'lodash/isEmpty';
import Vue from 'vue';

// TODO: currently mapStateToOneOfProps in core does not provide control enabled property
// currently used in handleTabChange when switching to the next tab and data needs to be cleared but no data changed should happend
// for example when the JsonForm is in read only state no data should be modified
const isControlEnabled = (
  ownProps: ControlProps,
  jsonforms: JsonFormsSubStates
): boolean => {
  const state = { jsonforms };
  const config = getConfig(state);
  const rootData = getData(state);
  const { uischema } = ownProps;

  const rootSchema = getSchema(state);

  return isInherentlyEnabled(
    state,
    ownProps,
    uischema,
    ownProps.schema || rootSchema,
    rootData,
    config
  );
};

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

    // TODO: once the enabled property is mapped by JsonForms core we can remove this jsonforms and controlEnabled variables
    const jsonforms = inject<JsonFormsSubStates>('jsonforms');
    if (!jsonforms) {
      throw new Error(
        "'jsonforms' couldn't be injected. Are you within JSON Forms?"
      );
    }
    const controlEnabled = computed(() =>
      isControlEnabled(props as ControlProps, jsonforms)
    );

    return {
      ...useVuetifyControl(input),
      selectedIndex,
      tabIndex,
      dialog,
      newSelectedIndex,
      controlEnabled,
    };
  },
  computed: {
    subSchema(): JsonSchema {
      return resolveSubSchemas(
        this.control.schema,
        this.control.rootSchema,
        'oneOf'
      );
    },
    oneOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      return createCombinatorRenderInfos(
        this.subSchema.oneOf!,
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
      // TODO change this.controlEnabled to this.control.enabled once this is suppored by JsonForms core - see above TODO comments
      if (this.controlEnabled && !isEmpty(this.control.data)) {
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
        createDefaultValue(this.control.schema.oneOf![this.newSelectedIndex])
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
