import { registerExamples } from './register';
import { personCoreSchema } from './person';
import 'moment/locale/de';

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
    },
    income: {
      type: 'number',
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
          label: '%birthday',
          scope: '#/properties/birthDate'
        },
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: '%height',
          scope: '#/properties/personalData/properties/height'
        },
        {
          type: 'Control',
          label: '%nationality',
          scope: '#/properties/nationality'
        },
        {
          type: 'Control',
          label: '%occupation',
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
        },
        {
          type: 'Control',
          label: {
            text: '%income',
            show: true
          },
          scope: '#/properties/income',
          options: {
            format: true
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
  postalCode: '12345',
  income: 100000023
};

const translations = {
  'en-US': {
    name: 'Name',
    height: 'Height',
    age: 'Age',
    nationality: 'Nationality',
    occupation: 'Occupation',
    birthday: 'Birthday',
    postalcode: 'Postal Code',
    drivingskill: 'Driving skill',
    namedescription: 'Please enter your full name.',
    income: 'Income'
  },
  'de-DE': {
    cancel: 'Stornieren',
    clear: 'Löschen',
    name: 'Name',
    height: 'Höhe',
    age: 'Alter',
    nationality: 'Staatsangehörigkeit',
    occupation: 'Tätigkeit',
    birthday: 'Geburtstag',
    postalcode: 'Postleitzahl',
    drivingskill: 'Fahrkönnen',
    namedescription: 'Bitte tragen Sie Ihren vollen Namen ein.',
    income: 'Gehalt'
  }
};

registerExamples([
  {
    name: 'i18n',
    label: 'I18n',
    data,
    schema,
    uiSchema: uischema,
    translations
  }
]);
