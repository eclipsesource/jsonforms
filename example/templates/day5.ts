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
const uischemaCategory = {
  'type': 'Categorization',
  'elements': [
    {
      'type': 'Category',
      'label': 'Main',
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
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/description'
          },
          'options': {
              'multi': true
          }
        }
      ]
    },
    {
      'type': 'Category',
      'label': 'Additional',
      'elements': [
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
    }
  ]
};
const data = {
  'name': 'Send email to Adriana',
  'description': 'Confirm if you have passed the subject\nHerby ...',
  'done': true,
  'recurrence': 'Daily'
};
registerExamples([
  {name: 'day5', label: 'Day 5', data: data, schema: schema, uiSchema: uischema},
  {name: 'day5_categegory', label: 'Day 5 With Category',
    data: data, schema: schema, uiSchema: uischemaCategory}
]);
