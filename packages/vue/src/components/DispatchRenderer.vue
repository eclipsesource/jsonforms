<template>
  <!-- Without slots, bind no slots: forwarded slots are dynamic, and dynamic
  slots make Vue render the child again each time this component renders. -->
  <component
    :is="determinedRenderer"
    v-if="!hasSlots()"
    v-bind="renderer"
  ></component>
  <component :is="determinedRenderer" v-else v-bind="renderer">
    <!-- Forward all slots dynamically -->
    <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </component>
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
        config: this.renderer.config,
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
  methods: {
    // A method, not a computed value: `$slots` is not reactive.
    hasSlots(): boolean {
      return Object.keys(this.$slots).length > 0;
    },
  },
});
</script>
