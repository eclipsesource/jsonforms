import { registerExamples } from './register';
import { data as personData, personCoreSchema } from './person';

export const schema = personCoreSchema;

export const uischema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Categorization',
      label: 'Sub',
      elements: [
        {
          type: 'Category',
          label: 'SubPrivate',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name'
            }
          ]
        },
        {
          type: 'Category',
          label: 'Additional',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/nationality'
            },
            {
              type: 'Control',
              scope: '#/properties/vegetarian'
            }
          ]
        }
      ]
    },
    {
      type: 'Category',
      label: 'Private',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name'
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate'
        }
      ]
    },
    {
      type: 'Category',
      label: 'Additional',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/birthDate'
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarian'
        }
      ]
    }
  ]
};

export const data = personData;

registerExamples([
  {
    name: 'categorization',
    label: 'Categorization',
    data,
    schema,
    uiSchema: uischema
  }
]);
