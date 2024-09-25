<template>
  <div v-if="control.visible">
    <combinator-properties
      :schema="control.schema"
      combinatorKeyword="anyOf"
      :path="path"
    />

    <v-tabs v-model="selectedIndex">
      <v-tab
        v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos"
        :key="`${control.path}-${anyOfIndex}`"
      >
        {{ anyOfRenderInfo.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="selectedIndex">
      <v-window-item
        v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos"
        :key="`${control.path}-${anyOfIndex}`"
      >
        <dispatch-renderer
          v-if="selectedIndex === anyOfIndex"
          :schema="anyOfRenderInfo.schema"
          :uischema="anyOfRenderInfo.uischema"
          :path="control.path"
          :renderers="control.renderers"
          :cells="control.cells"
          :enabled="control.enabled"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts">
import {
  type CombinatorSubSchemaRenderInfo,
  type ControlElement,
  createCombinatorRenderInfos,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  type RendererProps,
  useJsonFormsAnyOfControl,
} from '@jsonforms/vue';
import { VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components';
import { defineComponent, ref } from 'vue';
import { useVuetifyControl } from '../util';
import { CombinatorProperties } from './components';

const controlRenderer = defineComponent({
  name: 'any-of-renderer',
  components: {
    DispatchRenderer,
    CombinatorProperties,
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsAnyOfControl(props);
    const control = input.control.value;
    const selectedIndex = ref(control.indexOfFittingSchema || 0);

    return {
      ...useVuetifyControl(input),
      selectedIndex,
    };
  },
  computed: {
    anyOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.anyOf!,
        this.control.rootSchema,
        'anyOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas,
      );
      return result.filter((info) => info.uischema);
    },
  },
});

export default controlRenderer;
</script>
