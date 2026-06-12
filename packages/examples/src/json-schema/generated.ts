import type { JsonSchemaExample } from '../types';

export const generated: JsonSchemaExample = {
  id: 'generated-uischema',
  title: 'Generated UI Schema',
  description:
    'No UI schema is provided — the form structure is generated from the JSON Schema by the schema source.',
  schema: {
    type: 'object',
    title: 'Person',
    properties: {
      firstName: { type: 'string', title: 'First Name' },
      lastName: { type: 'string', title: 'Last Name' },
      birthYear: { type: 'integer', title: 'Year of Birth' },
      retired: { type: 'boolean', title: 'Retired' },
    },
  },
  data: {
    firstName: 'Grace',
    lastName: 'Hopper',
    birthYear: 1906,
  },
};
