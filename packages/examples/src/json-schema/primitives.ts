import type { JsonSchemaExample } from '../types';

export const primitives: JsonSchemaExample = {
  format: 'json-schema',
  id: 'primitives',
  title: 'Primitives',
  description:
    'All primitive control types with constraints, descriptions, a read-only field, and a multi-line text option.',
  schema: {
    type: 'object',
    title: 'Primitives',
    properties: {
      username: {
        type: 'string',
        title: 'Username',
        minLength: 3,
        maxLength: 20,
        description: 'Between 3 and 20 characters',
      },
      rating: {
        type: 'integer',
        title: 'Rating',
        minimum: 1,
        maximum: 5,
        description: 'From 1 to 5',
      },
      temperature: {
        type: 'number',
        title: 'Temperature (°C)',
        multipleOf: 0.5,
      },
      subscribed: {
        type: 'boolean',
        title: 'Subscribe to newsletter',
      },
      serial: {
        type: 'string',
        title: 'Serial Number',
        readOnly: true,
        description: 'Read-only — rendered disabled',
      },
      notes: {
        type: 'string',
        title: 'Notes',
        maxLength: 250,
      },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/username' },
          { type: 'Control', scope: '#/properties/rating' },
        ],
      },
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/temperature' },
          { type: 'Control', scope: '#/properties/subscribed' },
        ],
      },
      { type: 'Control', scope: '#/properties/serial' },
      {
        type: 'Control',
        scope: '#/properties/notes',
        options: { multi: true },
      },
    ],
  },
  data: {
    username: 'ada',
    rating: 5,
    serial: 'SN-0001',
  },
};
