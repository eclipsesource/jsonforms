<template>
  <div>
    <div>Control renderer</div>
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
      <pre>{{ JSON.stringify(control, null, 2) }}</pre>
    </div>
    <input v-bind:value="control.data" @change="onChange" />
    <div class="error" v-if="control.errors">{{ control.errors }}</div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
pre {
  background-color: lightgray;
}
</style>

<script lang="ts">
import {
  ControlElement,
  isControl,
  JsonFormsRendererRegistryEntry,
  rankWith
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '../../src/';

const controlRenderer = defineComponent({
  name: 'control-renderer',
  props: {
    ...rendererProps<ControlElement>()
  },
  setup(props) {
    return useJsonFormsControl(props);
  },
  methods: {
    onChange(event: Event) {
      this.handleChange(
        this.control.path,
        (event.target as HTMLInputElement).value
      );
    }
  }
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, isControl)
};
</script>
