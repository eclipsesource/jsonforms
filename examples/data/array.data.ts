export default angular.module('jsonforms-examples.array', [])
  .value('array.schema',
    {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'vegetarian': {
          'type': 'boolean'
        },
        'birthDate': {
          'type': 'string',
          'format': 'date-time'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        },
        'occupation': {
          'type': 'string'
        },
        'comments': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'date': {
                'type': 'string',
                'format': 'date-time'
              },
              'message': {
                'type': 'string'
              }
            }
          }
        }
      },
      'required': ['occupation', 'nationality']
    }
  )
  .value('array.uischema',
    {
      'type': 'VerticalLayout',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/comments'
          },
          'options': {
            'submit': true
          }
        }
      ]
    }
  )
  .value('array.uischema-simple',
    {
      'type': 'Control',
      'scope': {
        '$ref': '#/properties/comments'
      },
      'label': 'Some more comments',
      'options': {
        'simple': true
      }
    }
  )
  .value('array.data',
    {
      'comments': [
        {
          'date': new Date(),
          'message': 'This is an example message'
        },
        {
          'date': new Date(),
          'message': 'Get ready for booohay'
        }
      ]
    }
  )
.name;
