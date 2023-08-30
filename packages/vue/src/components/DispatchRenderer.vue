<template>
  <component :is="determinedRenderer" v-bind="renderer"></component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UnknownRenderer from './UnknownRenderer.vue';
import maxBy from 'lodash/maxBy';
import { rendererProps, useJsonFormsRenderer } from '../jsonFormsCompositions';

export default defineComponent({
  name: 'DispatchRenderer',
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsRenderer(props);
  },
  computed: {
    determinedRenderer(): any {
      const testerContext = {
        rootSchema: this.rootSchema,
        config: this.config,
      };
      const renderer = maxBy(this.renderer.renderers, (r) =>
        r.tester(this.renderer.uischema, this.renderer.schema, testerContext)
      );
      if (
        renderer === undefined ||
        renderer.tester(
          this.renderer.uischema,
          this.renderer.schema,
          testerContext
        ) === -1
      ) {
        return UnknownRenderer;
      } else {
        return renderer.renderer;
      }
    },
  },
});
</script>
