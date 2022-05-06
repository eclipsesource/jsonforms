<template>
  <component v-bind:is="determinedRenderer" v-bind="renderer"></component>
</template>

<script lang="ts">
import { defineComponent } from '../../config';
import UnknownRenderer from './UnknownRenderer.vue';
import maxBy from 'lodash/maxBy';
import { rendererProps, useJsonFormsRenderer } from '../jsonFormsCompositions';

export default defineComponent({
  name: 'dispatch-renderer',
  props: {
    ...rendererProps()
  },
  setup(props) {
    return useJsonFormsRenderer(props);
  },
  computed: {
    determinedRenderer(): any {
      const renderer = maxBy(this.renderer.renderers, r =>
        r.tester(this.renderer.uischema, this.renderer.schema, this.rootSchema)
      );
      if (
        renderer === undefined ||
        renderer.tester(this.renderer.uischema, this.renderer.schema, this.rootSchema) === -1
      ) {
        return UnknownRenderer;
      } else {
        return renderer.renderer;
      }
    }
  }
});
</script>
