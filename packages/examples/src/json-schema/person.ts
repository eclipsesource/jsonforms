import type { JsonSchemaExample } from '../types';

export const person: JsonSchemaExample = {
  id: 'person',
  title: 'Person',
  description:
    'A simple person form: horizontal and vertical layouts, all primitive control types, and AJV validation.',
  schema: {
    type: 'object',
    title: 'Person',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name',
        minLength: 2,
        description: 'Given name',
      },
      lastName: {
        type: 'string',
        title: 'Last Name',
        minLength: 2,
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 0,
        maximum: 130,
        description: 'Age in years',
      },
      height: {
        type: 'number',
        title: 'Height (m)',
        minimum: 0,
        maximum: 3,
        multipleOf: 0.01,
      },
      vegetarian: {
        type: 'boolean',
        title: 'Vegetarian',
        description: 'Prefers a meat-free diet',
      },
      about: {
        type: 'string',
        title: 'About',
        maxLength: 500,
        description: 'A few sentences about this person',
      },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/firstName' },
          { type: 'Control', scope: '#/properties/lastName' },
        ],
      },
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/age' },
          { type: 'Control', scope: '#/properties/height' },
          { type: 'Control', scope: '#/properties/vegetarian' },
        ],
      },
      {
        type: 'Control',
        scope: '#/properties/about',
        options: { multi: true },
      },
    ],
  },
  data: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    age: 36,
    vegetarian: false,
  },
};
