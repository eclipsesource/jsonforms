<script lang="ts">
import { defineComponent } from '../../config/vue';
import { JsonForms, JsonFormsChangeEvent } from '../../config/jsonforms';
import { vanillaRenderers, mergeStyles, defaultStyles } from '../../src';
import '../../vanilla.css';
import { get } from 'lodash';
import { JsonFormsI18nState } from '@jsonforms/core';

const schema = {
  properties: {
    string: {
      type: 'string',
      description: 'a string',
      pattern: '[a-z]+'
    },
    multiString: {
      type: 'string',
      description: 'a string',
    },
    boolean: {
      type: 'boolean',
      description: 'enable / disable number',
    },
    boolean2: {
      type: 'boolean',
      description: 'show / hide integer',
    },
    number: {
      type: 'number',
      description: 'a number',
    },
    integer: {
      type: 'integer',
      description: 'an integer',
    },
    enum: {
      type: 'string',
      enum: ['a', 'b', 'c'],
      description: 'an enum',
    },
    oneOfEnum: {
      oneOf: [
        { const: '1', title: 'Number 1' },
        { const: 'B', title: 'Foo' },
      ],
      description: 'one of enum',
    },
    date: {
      type: 'string',
      format: 'date',
      description: 'a date',
    },
    dateTime: {
      type: 'string',
      format: 'date-time',
      description: 'a date time',
    },
    time: {
      type: 'string',
      format: 'time',
      description: 'a time',
    },
    array: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
        },
      },
    },
  },
  required: ['string', 'number'],
} as any;

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/string',
              options: {
                placeholder: 'this is a placeholder',
              },
            },
            {
              type: 'Control',
              scope: '#/properties/multiString',
            },
            {
              type: 'Control',
              scope: '#/properties/boolean',
              options: {
                placeholder: 'boolean placeholder',
              },
            },
            {
              type: 'Control',
              scope: '#/properties/boolean2',
            },
            {
              type: 'Control',
              scope: '#/properties/number',
              rule: {
                effect: 'DISABLE',
                condition: {
                  scope: '#/properties/boolean',
                  schema: {
                    const: true,
                  },
                },
              },
            },
          ],
        },
        {
          type: 'Group',
          label: 'My group',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/integer',
              rule: {
                effect: 'HIDE',
                condition: {
                  scope: '#/properties/boolean2',
                  schema: {
                    const: true,
                  },
                },
              },
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/enum',
                },
                {
                  type: 'Control',
                  scope: '#/properties/oneOfEnum',
                },
                {
                  type: 'Control',
                  scope: '#/properties/date',
                  options: {
                    placeholder: 'date placeholder',
                  },
                },
              ],
            },
            {
              type: 'Control',
              scope: '#/properties/dateTime',
              options: {
                placeholder: 'date-time placeholder',
              },
            },
            {
              type: 'Control',
              scope: '#/properties/time',
              options: {
                placeholder: 'time placeholder',
                styles: {
                  control: {
                    root: 'control my-time',
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'Label',
      text: 'This is my label',
    },
    {
      type: 'Control',
      scope: '#/properties/array',
      options: {
        childLabelProp: 'age',
      },
    },
  ],
} as any;

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, {
  control: { root: 'my-control' },
});

export default defineComponent({
  name: 'app',
  components: {
    JsonForms,
  },
  data: function () {
    const i18n: Partial<JsonFormsI18nState> = { locale: 'en' };
    return {
      renderers: Object.freeze(vanillaRenderers),
      data: {
        number: 5,
      },
      schema,
      uischema,
      config: {
        hideRequiredAsterisk: true,
      },
      i18n
    };
  },
  methods: {
    setSchema() {
      this.schema = {
        properties: {
          name: {
            type: 'string',
            title: 'NAME',
            description: 'The name',
          },
        },
      };
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log(event);
      this.data = event.data;
    },
    translationChange(event: any) {
      try {
        const input = JSON.parse(event.target.value);
        (this as any).i18n.translate = (key: string, defaultMessage: string | undefined) => {
          const translated = get(input, key) as string;
          return translated ?? defaultMessage;
        };
      } catch (error) {
        console.log('invalid translation input');
      }
    },
    switchAsterisk() {
      this.config.hideRequiredAsterisk = !this.config.hideRequiredAsterisk;
    },
    adaptData() {
      this.data.number = 10;
    },
    adaptUiSchema() {
      this.uischema = {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'HorizontalLayout',
            elements: [
              {
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/string',
                    options: {
                      placeholder: 'this is a placeholder',
                    },
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/multiString',
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/boolean',
                    options: {
                      placeholder: 'boolean placeholder',
                    },
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/boolean2',
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/number',
                    rule: {
                      effect: 'DISABLE',
                      condition: {
                        scope: '#/properties/boolean',
                        schema: {
                          const: true,
                        },
                      },
                    },
                  },
                ],
              },
              {
                type: 'Group',
                label: 'My group',
                elements: [
                  {
                    type: 'Control',
                    scope: '#/properties/integer',
                    rule: {
                      effect: 'HIDE',
                      condition: {
                        scope: '#/properties/boolean2',
                        schema: {
                          const: true,
                        },
                      },
                    },
                  },
                  {
                    type: 'HorizontalLayout',
                    elements: [
                      {
                        type: 'Control',
                        scope: '#/properties/enum',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/oneOfEnum',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/date',
                        options: {
                          placeholder: 'date placeholder',
                        },
                      },
                    ],
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/dateTime',
                    options: {
                      placeholder: 'date-time placeholder',
                    },
                  },
                  {
                    type: 'Control',
                    scope: '#/properties/time',
                    options: {
                      placeholder: 'time placeholder',
                      styles: {
                        control: {
                          root: 'control my-time',
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'Label',
            text: 'This is my label',
          },
          {
            type: 'Control',
            scope: '#/properties/array',
            options: {
              childLabelProp: 'age',
            },
          },
        ],
      };
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
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
    <div class="form">
      <json-forms
        :data="data"
        :schema="schema"
        :uischema="uischema"
        :renderers="renderers"
        :config="config"
        :i18n="i18n"
        @change="onChange"
      />
      <button @click="setSchema">Set Schema</button>
      <button @click="switchAsterisk">Switch Asterisk</button>
      <button @click="adaptData">Adapt data</button>
      <button @click="adaptUiSchema">Adapt uischema</button>
    </div>
    <div class="data">
      <pre
        >{{ JSON.stringify(data, null, 2) }}
    </pre
      >
      <pre
        >{{ JSON.stringify(config, null, 2) }}
    </pre
      >
      <textarea @change="translationChange" />
    </div>
  </div>
</template>
