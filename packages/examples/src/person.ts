import { registerExamples } from './register';

export const personCoreSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      description: '%namedescription'
    },
    vegetarian: {
      type: 'boolean'
    },
    birthDate: {
      type: 'string',
      format: 'date',
      description: 'Please enter your birth date.'
    },
    nationality: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
    }
  }
};

export const schema = {
  type: 'object',
  properties: {
    ...personCoreSchema.properties,
    personalData: {
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          description: 'Please enter your age.'
        },
        height: {
          type: 'number'
        },
        drivingSkill: {
          type: 'number',
          maximum: 10,
          minimum: 1,
          default: 7
        }
      },
      required: ['age', 'height']
    },
    vegetarian: {
      type: 'boolean'
    },
    birthDate: {
      type: 'string',
      format: 'date'
    },
    occupation: {
      type: 'string'
    },
    postalCode: {
      type: 'string',
      maxLength: 5
    }
  },
  required: ['occupation', 'nationality']
};

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
          scope: '#/properties/personalData/properties/age'
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate'
        },
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/personalData/properties/height'
        },
        {
          type: 'Control',
          scope: '#/properties/nationality'
        },
        {
          type: 'Control',
          scope: '#/properties/occupation',
          suggestion: [
            'Accountant',
            'Engineer',
            'Freelancer',
            'Journalism',
            'Physician',
            'Student',
            'Teacher',
            'Other'
          ]
        }
      ]
    }
  ]
};

export const data = {
  name: 'John Doe',
  vegetarian: false,
  birthDate: '1985-06-02',
  personalData: {},
  postalCode: '12345'
};

registerExamples([
  {
    name: 'person',
    label: 'Person',
    data,
    schema,
    uiSchema: uischema
  }
]);
