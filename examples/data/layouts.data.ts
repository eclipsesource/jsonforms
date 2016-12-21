export default angular.module('jsonforms-examples.layouts', [])
  .value('layouts.schema',
    {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'birthDate': {
          'type': 'string',
          'format': 'date'
        }
      }
    }
  )
  .value('layouts.uischema-vertical',
    {
      'type': 'VerticalLayout',
      'elements': [
        {
          'type': 'Control',
          'label': 'Name',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'label': 'Birth Date',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        }
      ]
    }
  )
  .value('layouts.uischema-horizontal',
    {
      'type': 'HorizontalLayout',
      'elements': [
        {
          'type': 'Control',
          'label': 'Name',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'label': 'Birth Date',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        }
      ]
    }
  )
  .value('layouts.uischema-group',
    {
      'type': 'Group',
      'label': 'My Group',
      'elements': [
        {
          'type': 'Control',
          'label': 'Name',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'label': 'Birth Date',
          'scope': {
            '$ref': '#/properties/birthDate'
          }
        }
      ]
    }
  )
  .value('layouts.uischema-complex',
    {
      'type': 'Group',
      'label': 'My Group',
      'elements': [
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'VerticalLayout',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Name',
                  'scope': {
                    '$ref': '#/properties/name'
                  }
                },
                {
                  'type': 'Control',
                  'label': 'Birth Date',
                  'scope': {
                    '$ref': '#/properties/birthDate'
                  }
                }
              ]
            },
            {
              'type': 'VerticalLayout',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Name',
                  'scope': {
                    '$ref': '#/properties/name'
                  }
                },
                {
                  'type': 'Control',
                  'label': 'Birth Date',
                  'scope': {
                    '$ref': '#/properties/birthDate'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  )
  .value('layouts.data',
    {
      name: 'John Doe',
      birthDate: '1985-06-02'
    }
  )
.name;
