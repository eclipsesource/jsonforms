import type { JsonSchemaExample } from '../types';

export const validation: JsonSchemaExample = {
  id: 'validation',
  title: 'Validation',
  description:
    'Required fields, length, range, format, and pattern constraints. The initial data is invalid — touch a field (focus and blur it) to reveal its issues.',
  schema: {
    type: 'object',
    title: 'Validation',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        title: 'E-Mail',
        format: 'email',
      },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 8,
        description: 'At least 8 characters',
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 18,
        maximum: 100,
      },
      website: {
        type: 'string',
        title: 'Website',
        pattern: '^https?://.+',
        description: 'Must start with http:// or https://',
      },
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/email' },
      { type: 'Control', scope: '#/properties/password' },
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/age' },
          { type: 'Control', scope: '#/properties/website' },
        ],
      },
    ],
  },
  data: {
    email: 'ada@',
    password: 'short',
    age: 12,
    website: 'example',
  },
};
