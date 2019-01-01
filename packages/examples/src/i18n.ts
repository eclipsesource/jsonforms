import { registerExamples } from './register';
import { personCoreSchema } from './person';

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
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
      type: 'Label',
      text: 'Additional Information'
    },
    {
      type: 'HorizontalLayout',
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
};

export const data = {
  vegetarian: false,
  birthDate: '1985-06-02',
  personalData: {
    age: 34
  },
  postalCode: '12345'
};

registerExamples([
  {
    name: 'i18n',
    label: 'Person (i18n)',
    data,
    schema: personCoreSchema,
    uischema
  }
]);
