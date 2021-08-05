<template>
  <div id="demo">
    <json-forms
      v-bind:data="data"
      v-bind:schema="schema"
      v-bind:renderers="renderers"
      @change="onChange"
    />
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import { vuetifyRenderers } from '@jsonforms/vue2-vuetify';

const schema = {
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: "The task's name",
    },
    description: {
      title: 'Long Description',
      type: 'string',
    },
    done: {
      type: 'boolean',
    },
    dueDate: {
      type: 'string',
      format: 'date',
      description: "The task's due date",
    },
    rating: {
      type: 'integer',
      maximum: 5,
    },
    recurrence: {
      type: 'string',
      enum: ['Never', 'Daily', 'Weekly', 'Monthly'],
    },
    recurrenceInterval: {
      type: 'integer',
      description: 'Amount of days until recurrence',
    },
  },
};
const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
        {
          type: 'Control',
          scope: '#/properties/description',
          options: {
            multi: true,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/done',
        },
      ],
    },
    {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/dueDate',
        },
        {
          type: 'Control',
          scope: '#/properties/rating',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrence',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrenceInterval',
        },
      ],
    },
  ],
};
export default defineComponent({
  name: 'JsonFormsDemo',
  components: {
    JsonForms,
  },
  data() {
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(vuetifyRenderers),
      data: {
        name: 'Send email to Adrian',
        description: 'Confirm if you have passed the subject\nHereby ...',
        done: true,
        recurrence: 'Daily',
        rating: 3,
      },
      schema,
      uischema,
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data = event.data;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}

.layout-item {
  flex: 1;
}
</style>
