import { registerExamples } from './register';
import { data as day4Data, schema as day4Schema } from './day4';

export const schema = day4Schema;

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done'
    },
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/dueDate'
        },
        {
          type: 'Control',
          scope: '#/properties/rating'
        }
      ]
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
          multi: true
      }
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/recurrence'
        },
        {
          type: 'Control',
          scope: '#/properties/recurrenceInterval',
          rule: {
              effect: 'HIDE',
              condition: {
                  scope: '#/properties/recurrence',
                  expectedValue: 'Never'
              }
          }
        }
      ]
    }
  ]
};

export const categoryUiSchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Main',
      elements: [
        {
          type: 'Control',
          label: false,
          scope: '#/properties/done'
        },
        {
          type: 'Control',
          scope: '#/properties/name'
        },
        {
          type: 'Control',
          scope: '#/properties/description',
          options: {
              'multi': true
          }
        }
      ]
    },
    {
      type: 'Category',
      label: 'Additional',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/dueDate'
            },
            {
              type: 'Control',
              scope: '#/properties/rating'
            }
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/recurrence'
            },
            {
              type: 'Control',
              scope: '#/properties/recurrenceInterval',
              rule: {
                  effect: 'HIDE',
                  condition: {
                      scope: '#/properties/recurrence',
                      expectedValue: 'Never'
                  }
              }
            }
          ]
        }
      ]
    }
  ]
};

export const data = day4Data;

registerExamples([
  {
    name: 'day5',
    label: 'Day 5',
    data,
    schema,
    uiSchema: uischema
  },
  {
    name: 'day5_category',
    label: 'Day 5 With Category',
    data,
    schema,
    uiSchema: categoryUiSchema
  }
]);
