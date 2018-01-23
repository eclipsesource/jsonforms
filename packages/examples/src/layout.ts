import { registerExamples } from './register';
import { data as personData, schema as personSchema } from './person';

export const schema = personSchema;

export const uischemaVertical = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate'
    }
  ]
};
export const uischemaHorizontal = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate'
    }
  ]
};
export const uischemaGroup = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate'
    }
  ]
};
export const uischemaComplex = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/name'
            },
            {
              type: 'Control',
              label: 'Birth Date',
              scope: '#/properties/birthDate'
            }
          ]
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/name'
            },
            {
              type: 'Control',
              label: 'Birth Date',
              scope: '#/properties/birthDate'
            }
          ]
        }
      ]
    }
  ]
};
export const data = personData;

registerExamples([
  {
    name: 'layout-vertical',
    label: 'Layout Vertical',
    data,
    schema,
    uiSchema: uischemaVertical
  },
  {
    name: 'layout-horizontal',
    label: 'Layout Horizontal',
    data,
    schema,
    uiSchema: uischemaHorizontal
  },
  {
    name: 'layout-group',
    label: 'Layout Group',
    data,
    schema,
    uiSchema: uischemaGroup
  },
  {
    name: 'layout-complex',
    label: 'Layout Complex',
    data,
    schema,
    uiSchema: uischemaComplex
  }
]);
