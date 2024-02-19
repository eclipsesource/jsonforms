<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms, JsonFormsChangeEvent } from '../../config/jsonforms';
import { vanillaRenderers, mergeStyles, defaultStyles } from '../../src';
import '../../vanilla.css';
import { ErrorObject } from 'ajv';
import { getExamples } from '../../../examples';
import get from 'lodash/get';

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

const examples = getExamples();

export default defineComponent({
  name: 'App',
  components: {
    JsonForms,
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
  data: function () {
    const additionalErrors: ErrorObject[] = [];
    return {
      data: {},
      renderers: Object.freeze(vanillaRenderers),
      currentExampleName: examples[0].name,
      examples,
      i18n: examples[0].i18n,
      additionalErrors,
    };
  },
  computed: {
    example() {
      const name = (this as any).currentExampleName;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return examples.find((ex) => ex.name === name)!;
    },
  },
  beforeMount() {
    const searchURL = new URL(String(window.location));
    const name = searchURL.hash?.substring(1);
    const exists = name && examples.find((ex) => ex.name === name);
    if (name && exists) {
      this.currentExampleName = name;
    }
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
      this.data = event.data;

      const searchURL = new URL(String(window.location));
      searchURL.hash = this.currentExampleName;
      window.history.pushState({}, '', searchURL);
    },
    onExampleChange(event: any) {
      this.currentExampleName = event.target.value;
    },
    translationChange(event: any) {
      try {
        const input = JSON.parse(event.target.value);
        (this as any).i18n.translate = (
          key: string,
          defaultMessage: string | undefined
        ) => {
          const translated = get(input, key) as string;
          return translated ?? defaultMessage;
        };
      } catch (error) {
        console.log('invalid translation input');
      }
    },
  },
});
</script>

<template>
  <div class="container">
    <header>
      <h1>Welcome to JSON Forms with Vue Vanilla</h1>
      <p>More Forms. Less Code.</p>
    </header>

    <aside class="example-selector">
      <div class="data">
        <details>
          <summary>data</summary>
          <pre
            >{{ JSON.stringify(data, null, 2) }}
          </pre>
        </details>

        <details>
          <summary>schema</summary>
          <pre
            >{{ JSON.stringify(example.schema, null, 2) }}
          </pre>
        </details>

        <details>
          <summary>uischema</summary>
          <pre
            >{{ JSON.stringify(example.uischema, null, 2) }}
          </pre>
        </details>

        <h5>i18n translator</h5>
        <textarea @change="translationChange"></textarea>
      </div>
    </aside>

    <div class="tools">
      <h4>Select Example:</h4>
      <select v-model="currentExampleName" @change="onExampleChange($event)">
        <option
          v-for="option in examples"
          :key="option.name"
          :value="option.name"
          :label="option.label"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <main class="form">
      <article>
        <json-forms
          :key="example.name"
          :data="example.data"
          :schema="example.schema"
          :uischema="example.uischema"
          :renderers="renderers"
          :i18n="example.i18n"
          :additional-errors="additionalErrors"
          @change="onChange"
        >
        </json-forms>
      </article>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 0 30% auto 0;
  grid-column-gap: 2rem;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header header header header'
    '. tools tools .'
    '. aside main .';
}
.container > header {
  grid-area: header;

  background-color: #00021e;
  padding: 2rem;
  color: white;
  text-align: center;
}
.container > aside {
  grid-area: aside;
}
.container > main {
  grid-area: main;
}
.container > .tools {
  grid-area: tools;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

aside .data {
  background-color: white;
  padding: 2rem;
}
aside summary,
aside h5 {
  font-size: 0.83em;
  font-weight: bold;
  margin: 0 0 1em;
}
aside summary {
  cursor: default;
}
aside details pre {
  background: #eee;
  border: 0;
  min-height: 300px;
  max-height: 500px;
  overflow: scroll;
}

main article {
  background-color: white;
  padding: 1rem;
}
</style>


<style>
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: #f3f4fa;
}
</style>
