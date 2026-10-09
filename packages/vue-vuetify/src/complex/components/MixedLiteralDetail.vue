<template>
  <json-forms v-bind="$attrs" :schema="isolatedSchema" :renderers="renderers" />
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type PropType,
} from 'vue';
import { JsonForms } from '@jsonforms/vue';
import type {
  JsonSchema,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import { literalPropertySchema } from '../../util/literalPropertySchema';
interface Navigation {
  selectPath: (path: string) => void;
  selectedPath: ComputedRef<string | undefined>;
}
const navigationKey: InjectionKey<Navigation> = Symbol.for(
  'jsonforms-vue-vuetify:MixedRendererNavigationContext',
);
export default defineComponent({
  name: 'mixed-literal-detail',
  inheritAttrs: false,
  components: { JsonForms },
  props: {
    renderers: {
      type: Array as PropType<JsonFormsRendererRegistryEntry[]>,
      required: true,
    },
    nodePath: { type: String, required: true },
    schema: { type: Object as PropType<JsonSchema>, required: true },
    rootSchema: { type: Object as PropType<JsonSchema>, required: true },
  },
  setup(props) {
    const parent = inject(navigationKey)!;
    provide(navigationKey, {
      selectedPath: computed(() =>
        parent.selectedPath.value === props.nodePath
          ? ''
          : parent.selectedPath.value,
      ),
      selectPath: (path) =>
        parent.selectPath(path ? `${props.nodePath}.${path}` : props.nodePath),
    });
    return {
      isolatedSchema: computed(() =>
        literalPropertySchema(props.schema, props.rootSchema),
      ),
    };
  },
});
</script>
