<template>
  <div v-if="control.visible">
    <template v-if="delegateUISchema">
      <dispatch-renderer
        :schema="subSchema"
        :uischema="delegateUISchema"
        :path="control.path"
        :enabled="control.enabled"
        :renderers="control.renderers"
        :cells="control.cells"
      />
    </template>
    <template v-else-if="allOfRenderInfos">
      <dispatch-renderer
        v-for="(allOfRenderInfo, allOfIndex) in allOfRenderInfos"
        :key="`${control.path}-${allOfIndex}`"
        :schema="allOfRenderInfo.schema"
        :uischema="allOfRenderInfo.uischema"
        :path="control.path"
        :enabled="control.enabled"
        :renderers="control.renderers"
        :cells="control.cells"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  CombinatorSubSchemaRenderInfo,
  ControlElement,
  createCombinatorRenderInfos,
  findMatchingUISchema,
  isAllOfControl,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  rankWith,
  resolveSubSchemas,
  UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  RendererProps,
  useJsonFormsAllOfControl,
} from '@jsonforms/vue2';
import { defineComponent } from '../vue';
import { useVuetifyControl } from '../util';

const controlRenderer = defineComponent({
  name: 'all-of-renderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(useJsonFormsAllOfControl(props));
  },
  computed: {
    subSchema(): JsonSchema {
      return resolveSubSchemas(
        this.control.schema,
        this.control.rootSchema,
        'allOf'
      );
    },
    delegateUISchema(): UISchemaElement {
      return findMatchingUISchema(this.control.uischemas)(
        this.subSchema,
        this.control.uischema.scope,
        this.control.path
      );
    },
    allOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      return createCombinatorRenderInfos(
        this.subSchema.allOf!,
        this.control.rootSchema,
        'allOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas
      );
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(3, isAllOfControl),
};
</script>
