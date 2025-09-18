<template>
  <div>
    Nuxt module for JSON Forms!
    <JsonForms :schema="schema" :uischema="uischema" v-model="data" />
    <div>Final data:</div>
    {{ data }}
  </div>
</template>

<script setup>
const schema = {
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: "The task's name",
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
      ],
    },
  ],
};

const data = ref({
  name: 'My Task',
});
</script>
