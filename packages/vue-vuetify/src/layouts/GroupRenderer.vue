<template>
  <v-card
    v-if="layout.visible"
    :class="classes"
    :elevation="!bare ? 2 : undefined"
    :outlined="bare"
    v-bind="vuetifyProps('v-card')"
  >
    <v-card-title
      v-if="layout.label"
      :class="styles.group.label"
      v-bind="vuetifyProps('v-card-title')"
      >{{ layout.label }}</v-card-title
    >

    <v-card-text
      v-bind="vuetifyProps(`v-card-text[${index}]`)"
      v-for="(element, index) in (layout.uischema as Layout).elements"
      :key="`${layout.path}-${index}`"
      :class="styles.group.item"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { type Layout } from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { VCard, VCardText, VCardTitle } from 'vuetify/components';
import { useVuetifyLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    bare(): boolean {
      return !!this.appliedOptions.bare;
    },
    alignLeft(): boolean {
      return !!this.appliedOptions.alignLeft;
    },
    classes(): string {
      const classes = ['my-1', 'pa-0', `${this.styles.group.root}`];
      if (this.bare) {
        classes.push(`${this.styles.group.bare}`);
      }
      if (this.alignLeft) {
        classes.push(`${this.styles.group.alignLeft}`);
      }
      return classes.join(' ');
    },
  },
});

export default layoutRenderer;
</script>

<!-- Default styles for the 'nested' feature -->
<style scoped>
.group.group-bare {
  border: 0;
}
.group-bare > .group-label,
.group-bare > .group-item {
  padding-right: 0;
}
.group-align-left > .group-label,
.group-align-left > .group-item {
  padding-left: 0;
}
</style>
