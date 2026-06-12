import type { JsonSchemaExample } from '../types';

export const layouts: JsonSchemaExample = {
  format: 'json-schema',
  id: 'layouts',
  title: 'Nested Layouts',
  description: 'Horizontal and vertical layouts nested into each other.',
  schema: {
    type: 'object',
    title: 'Address',
    properties: {
      street: { type: 'string', title: 'Street' },
      streetNumber: { type: 'string', title: 'No.' },
      zip: { type: 'string', title: 'ZIP' },
      city: { type: 'string', title: 'City' },
      state: { type: 'string', title: 'State' },
      country: { type: 'string', title: 'Country' },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/street' },
          { type: 'Control', scope: '#/properties/streetNumber' },
        ],
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/zip' },
              { type: 'Control', scope: '#/properties/city' },
            ],
          },
          {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/state' },
              { type: 'Control', scope: '#/properties/country' },
            ],
          },
        ],
      },
    ],
  },
  data: {
    street: 'Agnes-Pockels-Bogen',
    streetNumber: '1',
    city: 'Munich',
    country: 'Germany',
  },
};
