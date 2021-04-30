<template>
  <div>
    <div>Layout renderer</div>
    <div>
      Schema:
      <pre>{{ JSON.stringify(schema, null, 2) }}</pre>
    </div>
    <div>
      UI Schema:
      <pre>{{ JSON.stringify(uischema) }}</pre>
    </div>
    <div>
      Path:
      <pre>{{ path }}</pre>
    </div>
    <div>
      Computed Props:
      <pre>{{ JSON.stringify(layout, null, 2) }}</pre>
    </div>
    <div>Children:</div>
    <div
      v-for="(element, index) in layout.uischema.elements"
      v-bind:key="`${layout.path}-${index}`"
    >
      <dispatch-renderer
        v-bind:schema="layout.schema"
        v-bind:uischema="element"
        v-bind:path="layout.path"
      />
    </div>
  </div>
</template>

<style scoped>
pre {
  background-color: lightgray;
}
</style>

<script lang="ts">
import {
  isLayout,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith
} from '@jsonforms/core';
import { defineComponent } from "../../config";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout
} from '../../src/';

const layoutRenderer = defineComponent({
  name: 'layout-renderer',
  components: {
    DispatchRenderer
  },
  props: {
    ...rendererProps<Layout>()
  },
  setup(props) {
    return useJsonFormsLayout(props);
  }
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(1, isLayout)
};
</script>
