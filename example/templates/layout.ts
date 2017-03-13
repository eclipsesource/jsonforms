import {registerExamples} from '../example';
const schema = {
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
};
const uischema_vertical = {
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
};
const uischema_horizontal = {
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
};
const uischema_group = {
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
};
const uischema_complex = {
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
};
const data = {
  name: 'John Doe',
  birthDate: '1985-06-02'
};
registerExamples([
  {name: 'layout-vertical', label: 'Layout Vertical', data: data,
    schema: schema, uiSchema: uischema_vertical},
  {name: 'layout-horizontal', label: 'Layout Horizontal', data: data,
    schema: schema, uiSchema: uischema_horizontal},
  {name: 'layout-group', label: 'Layout Group', data: data,
    schema: schema, uiSchema: uischema_group},
  {name: 'layout-complex', label: 'Layout Complex', data: data,
    schema: schema, uiSchema: uischema_complex}
]);
