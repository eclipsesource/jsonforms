<script lang="ts">
import { defineComponent } from '../../config/vue';
import { JsonForms, JsonFormsChangeEvent } from '../../config/jsonforms';
import { vanillaRenderers, mergeStyles, defaultStyles } from '../../src';
import '../../vanilla.css';
import { JsonFormsI18nState } from '@jsonforms/core';
import { ErrorObject } from 'ajv';

import { getExamples } from '../../../../examples';

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' }
});

const examples = getExamples();

export default defineComponent({
  name: 'app',
  components: {
    JsonForms
  },
  data: function() {
    const i18n: Partial<JsonFormsI18nState> = { locale: 'en' };
    const additionalErrors: ErrorObject[] = [];
    return {
      renderers: Object.freeze(vanillaRenderers),
      currentExampleName: examples[0].name,
      examples,
      config: {
        hideRequiredAsterisk: true
      },
      i18n,
      additionalErrors
    };
  },
  computed: {
    example() {
      const name = (this as any).currentExampleName;
      return examples.find(ex => ex.name === name)!;
    }
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
    },
    onExampleChange(event: any) {
      this.currentExampleName = event.target.value;
    }
  },
  provide() {
    return {
      styles: myStyles
    };
  }
});
</script>

<style scoped>
.form {
  max-width: 500px;
  flex: 1;
}
.container {
  display: flex;
}
.data {
  flex: 1;
}
</style>

<template>
  <div class="container">
    <div className="example-selector">
      <h4>Select Example:</h4>
      <select @change="onExampleChange($event)" v-model="currentExampleName">
        <option
          v-for="option in examples"
          :key="option.name"
          :value="option.name"
          :label="option.label"
          >{{ option.label }}</option
        >
      </select>
    </div>

    <div class="form">
      <json-forms
        :data="example.data"
        :schema="example.schema"
        :uischema="example.uischema"
        :renderers="renderers"
        :config="config"
        :i18n="i18n"
        :additional-errors="additionalErrors"
        @change="onChange"
      />
    </div>
  </div>
</template>
