import { registerExamples } from './register';

export const personCoreSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your full name.'
    },
    vegetarian: {
      type: 'boolean'
    },
    birthDate: {
      type: 'string',
      format: 'date'
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
          label: {
            text: '%name',
            show: true
          },
          scope: '#/properties/name'
        },
        {
          type: 'Control',
          label: {
            text: '%age'
          },
          scope: '#/properties/personalData/properties/age'
        },
        {
          type: 'Control',
          label: '%height',
          scope: {
            $ref: '#/properties/personalData/properties/height'
          }
        },
        {
          type: 'Control',
          label: {
            text: '%age'
          },
          scope: '#/properties/personalData/properties/age'
        },
        {
          type: 'Control',
          scope: '#/properties/personalData/properties/drivingSkill'
        },
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: '%nationality',
          scope: {
            $ref: '#/properties/nationality'
          }
        },
        {
          type: 'Control',
          label: '%height',
          scope: {
            $ref: '#/properties/personalData/properties/height'
          }
        },
        {
          type: 'Control',
          label: '%occupation',
          scope: {
            $ref: '#/properties/occupation'
          },
          suggestion: ['Accountant', 'Engineer', 'Freelancer',
            'Journalism', 'Physician', 'Student', 'Teacher', 'Other']
        },
        {
          type: 'Control',
          label: '%birthday',
          scope: {
            $ref: '#/properties/birthDate'
          }
        }
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/postalCode',
          options: {
            trim: true,
            restrict: true
          }
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

const translations = {
  'en-US': {
    name: 'Name',
    height: 'Height',
    age: 'Age',
    nationality: 'Nationality',
    occupation: 'Occupation',
    birthday: 'Birthday',
  },
  'de-DE': {
    name: 'Name',
    height: 'Höhe',
    age: 'Alter',
    nationality: 'Staatsangehörigkeit',
    occupation: 'Besetzung',
    birthday: 'Geburtstag',
  }
};

const locale = 'de-DE';

registerExamples([
  {
    name: 'person',
    label: 'Person',
    data,
    schema,
    uiSchema: uischema,
    translations,
    locale
  }
]);
