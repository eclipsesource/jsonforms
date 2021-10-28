<template>
  <v-label v-if="layout.visible" :class="styles.label.root">
    {{ translatedLabel }}
  </v-label>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  uiTypeIs,
  LabelElement,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyLayout, useTranslator } from '../util';
import { VLabel } from 'vuetify/lib';

const labelRenderer = defineComponent({
  name: 'label-renderer',
  components: {
    DispatchRenderer,
    VLabel,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const t = useTranslator();
    const layout = useVuetifyLayout(useJsonFormsLayout(props));
    return { ...layout, t };
  },
  computed: {
    translatedLabel(): string | undefined {
      if (this.layout.uischema.options?.i18n) {
        return this.t(
          this.layout.uischema.options.i18n,
          (this.layout.uischema as LabelElement).text
        );
      }
      return this.t(
        (this.layout.uischema as LabelElement).text,
        (this.layout.uischema as LabelElement).text
      );
    },
  },
});

export default labelRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: labelRenderer,
  tester: rankWith(1, uiTypeIs('Label')),
};
</script>
