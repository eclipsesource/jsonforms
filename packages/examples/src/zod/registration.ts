import { z } from 'zod';
import type { ZodExample } from '../types';

const schema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .meta({ title: 'User Name', description: 'Between 3 and 20 characters' }),
  email: z.email().describe('Validated by zod — no AJV involved'),
  age: z.int().min(18).max(100).optional().describe('18 to 100'),
  newsletter: z.boolean().default(false),
  displayName: z.string().optional(),
});

export const zodRegistration: ZodExample = {
  format: 'zod',
  id: 'zod-registration',
  title: 'Registration',
  description:
    'A form driven by a zod schema instead of a JSON Schema: facets like labels, constraints and required-ness are introspected from the zod type tree, and the schema itself validates. Note the scopes in the UI schema — plain data pointers, no #/properties indirection.',
  schema,
  schemaText: `z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .meta({ title: 'User Name', description: 'Between 3 and 20 characters' }),
  email: z.email().describe('Validated by zod — no AJV involved'),
  age: z.int().min(18).max(100).optional().describe('18 to 100'),
  newsletter: z.boolean().default(false),
  displayName: z.string().optional(),
})`,
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '/username' },
          { type: 'Control', scope: '/displayName' },
        ],
      },
      { type: 'Control', scope: '/email' },
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '/age' },
          { type: 'Control', scope: '/newsletter' },
        ],
      },
    ],
  },
  data: {
    username: 'ada',
    email: 'ada@example.org',
  },
};
