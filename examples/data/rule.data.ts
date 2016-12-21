export default angular.module('jsonforms-examples.rule', [])
  .value('rule.schema',
    {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'birthDate': {
          'type': 'string',
          'format': 'date'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        }
      }
    }
  )
  .value('rule.uischema',
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'label': 'Name',
          'scope': {
              '$ref': '#/properties/name'
          },
          'rule': {
            'effect': 'HIDE',
            'condition': {
              'type': 'LEAF' ,
              'scope': {
                '$ref': '#/properties/nationality'
              },
              'expectedValue': 'DE'
            }
          }
        },
        {
          'type': 'Control',
          'label': 'Birth Date',
          'scope': {
              '$ref': '#/properties/birthDate'
          },
          'rule': {
            'effect': 'SHOW',
            'condition': {
              'type': 'LEAF' ,
              'scope': {
                '$ref': '#/properties/nationality'
              },
              'expectedValue': 'DE'
            }
          }
        },
        {
          'type': 'Control',
          'label': 'Nationality',
          'scope': {
            '$ref': '#/properties/nationality'
          }
        }
      ]
    }
  )
  .value('rule.data',
    {
      name: 'John Doe',
      birthDate: '1985-06-02',
      nationality: 'DE'
    }
  )
.name;
