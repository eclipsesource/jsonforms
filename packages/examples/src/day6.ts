import { registerExamples } from './register';
import {
  JsonFormsElement,
  registerRenderer,
  unregisterRenderer
} from '@jsonforms/core';
import ConnectedRatingControl, { ratingControlTester } from './rating.control';
const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'done': {
      'type': 'boolean'
    },
    'due_date': {
      'type': 'string',
      'format': 'date'
    },
    'rating': {
      'type': 'integer',
      'maximum': 5
    },
    'recurrence': {
        'type': 'string',
        'enum': ['Never', 'Daily', 'Weekly', 'Monthly']
    },
    'recurrence_interval': {
        'type': 'integer'
    }
  },
  'required': ['name']
};
const uischema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': false,
      'scope': {
        '$ref': '#/properties/done'
      }
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/name'
      }
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/due_date'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/rating'
          }
        }
      ]
    },
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/description'
      },
      'options': {
          'multi': true
      }
    },
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/recurrence'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/recurrence_interval'
          },
          'rule': {
              'effect': 'HIDE',
              'condition': {
                  'scope': {
                      '$ref': '#/properties/recurrence'
                  },
                  'expectedValue': 'Never'
              }
          }
        }
      ]
    }
  ]
};
const data =  {
  'name': 'Send email to Adriana',
  'description': 'Confirm if you have passed the subject\nHerby ...',
  'done': true,
  'recurrence': 'Daily',
  'rating': 3,
};

const setup = (div: HTMLDivElement) => {
  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Register Custom Control';
  buttonRegister.onclick = () => {
    const jsonForms =  document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    jsonForms.store.dispatch(registerRenderer(ratingControlTester, ConnectedRatingControl));
  };
  div.appendChild(buttonRegister);
  const buttonUnregister = document.createElement('button');
  buttonUnregister.innerText = 'Unregister Custom Control';
  buttonUnregister.onclick = () => {
    const jsonForms =  document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    jsonForms.store.dispatch(unregisterRenderer(ratingControlTester, ConnectedRatingControl));
  };
  div.appendChild(buttonUnregister);
};
registerExamples([
  {
    name: 'day6',
    label: 'Day 6',
    data,
    schema,
    uiSchema: uischema,
    setupCallback: setup
  }
]);
