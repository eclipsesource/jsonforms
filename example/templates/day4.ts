import { registerExamples } from '../example';
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
      'scope': {
        '$ref': '#/properties/name'
      }
    },
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
        '$ref': '#/properties/description'
      },
      'options': {
        'multi': true
      }
    },
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
    },
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
};
const data = {
    'name': 'Send email to Adriana',
    'description': 'Confirm if you have passed the subject\nHerby ...',
    'done': true,
    'recurrence': 'Never',
    'recurrence_interval': 5
};
registerExamples([
  {name: 'day4', label: 'Day 4', data: data, schema: schema, uiSchema: uischema}
]);
