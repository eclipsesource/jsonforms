export default angular.module('jsonforms-examples.category', [])
  .value('category.schema',
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
          'format': 'date'
        },
        'nationality': {
          'type': 'string',
          'enum': ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        }
      }
    }
  )
  .value('category.uischema',
    {
      'type': 'Categorization',
      'elements': [
        {
          'type': 'Categorization',
          'label': 'Sub',
          'elements': [
            {
              'type': 'Category',
              'label': 'SubPrivate',
              'elements': [
                {
                  'type': 'Control',
                  'scope': {
                    '$ref': '#/properties/name'
                  }
                }
              ]
            },
            {
              'type': 'Category',
              'label': 'Additional',
              'elements': [
                {
                  'type': 'Control',
                  'scope': {
                    '$ref': '#/properties/nationality'
                  }
                },
                {
                  'type': 'Control',
                  'scope': {
                    '$ref': '#/properties/vegetarian'
                  }
                }
              ]
            }
          ]
        },
        {
          'type': 'Category',
          'label': 'Private',
          'elements': [
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/name'
              }
            },
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/birthDate'
              }
            }
          ]
        },
        {
          'type': 'Category',
          'label': 'Additional',
          'elements': [
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/birthDate'
              }
            },
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/vegetarian'
              }
            }
          ]
        }
      ]
    }
  )
  .value('category.uischema-expandbar',
    {
      'type': 'Categorization',
      'options': {
        'expandbar': true
      },
      'elements': [
        {
          'type': 'Categorization',
          'label': 'A',
          'elements': [
            {
              'type': 'Category',
              'label': 'Private A',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Name',
                  'scope': {
                    '$ref': '#/properties/name'
                  }
                }
              ]
            },
            {
              'type': 'Category',
              'label': 'Additional A',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Height',
                  'scope': {
                    '$ref': '#/properties/nationality'
                  }
                }
              ]
            }
          ]
        },
        {
          'type': 'Categorization',
          'label': 'B',
          'elements': [
            {
              'type': 'Category',
              'label': 'Private B',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Age',
                  'scope': {
                    '$ref': '#/properties/birthDate'
                  }
                }
              ]
            },
            {
              'type': 'Category',
              'label': 'Additional B',
              'elements': [
                {
                  'type': 'Control',
                  'label': 'Vegetarian',
                  'scope': {
                    '$ref': '#/properties/vegetarian'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  )
  .value('category.data',
    {
      name: 'John Doe',
      vegetarian: false,
      birthDate: '1985-06-02',
      nationality: 'DE'
    }
  )
.name;
