<template>
  <fieldset v-if="control.visible">
    <legend>
      <button
        class="btn btn-secondary me-2"
        type="button"
        :disabled="
          !control.enabled || (appliedOptions.restrict && maxItemsReached)
        "
        @click="addButtonClick"
      >
        <i :class="styles.addButton ?? 'bi bi-plus-lg'"></i>
      </button>
      <label class="form-label">
        {{ control.label }}
      </label>
    </legend>
    <div
      v-for="(element, index) in control.data"
      :key="`${control.path}-${index}`"
      class="card m-1"
    >
      <div class="card-body">
        <array-list-element
          :move-up="moveUp(control.path, index)"
          :move-up-enabled="control.enabled && index > 0"
          :move-down="moveDown(control.path, index)"
          :move-down-enabled="control.enabled && index < control.data.length - 1"
          :delete-enabled="control.enabled && !minItemsReached"
          :delete="removeItems(control.path, [index])"
          :label="childLabelForIndex(index)"
          :styles="styles"
        >
          <dispatch-renderer
            :schema="control.schema"
            :uischema="childUiSchema"
            :path="composePaths(control.path, `${index}`)"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
          />
        </array-list-element>
      </div>
    </div>
    <div v-if="noData">
      {{ control.translations.noDataMessage }}
    </div>
  </fieldset>
</template>

<script lang="ts">
import {
  composePaths,
  createDefaultValue,
  JsonFormsRendererRegistryEntry,
  rankWith,
  ControlElement,
  schemaTypeIs,
  Resolve,
  JsonSchema,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  RendererProps,
} from '../../config/jsonforms';
import { useVanillaArrayControl } from '../util';
import ArrayListElement from './ArrayListElement.vue';

const controlRenderer = defineComponent({
  name: 'ArrayListRenderer',
  components: {
    ArrayListElement,
    DispatchRenderer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaArrayControl(useJsonFormsArrayControl(props));
  },
  computed: {
    noData(): boolean {
      return !this.control.data || this.control.data.length === 0;
    },
    arraySchema(): JsonSchema | undefined {
      return Resolve.schema(
        this.schema,
        this.control.uischema.scope,
        this.control.rootSchema
      );
    },
    maxItemsReached(): boolean | undefined {
      return (
        this.arraySchema !== undefined &&
        this.arraySchema.maxItems !== undefined &&
        this.control.data !== undefined &&
        this.control.data.length >= this.arraySchema.maxItems
      );
    },
    minItemsReached(): boolean | undefined {
      return (
        this.arraySchema !== undefined &&
        this.arraySchema.minItems !== undefined &&
        this.control.data !== undefined &&
        this.control.data.length <= this.arraySchema.minItems
      );
    },
  },
  methods: {
    composePaths,
    createDefaultValue,
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema, this.control.rootSchema)
      )();
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, schemaTypeIs('array')),
};
</script>
