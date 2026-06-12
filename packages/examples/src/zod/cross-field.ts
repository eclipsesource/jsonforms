import { z } from 'zod';
import type { ZodExample } from '../types';

const schema = z
  .object({
    title: z.string().min(1),
    startDate: z.string().describe('YYYY-MM-DD'),
    endDate: z.string().describe('YYYY-MM-DD'),
  })
  .refine((trip) => trip.endDate >= trip.startDate, {
    path: ['endDate'],
    message: 'must not be before the start date',
  });

export const zodCrossField: ZodExample = {
  format: 'zod',
  id: 'zod-cross-field',
  title: 'Cross-Field Rule',
  description:
    'A zod refinement validates across fields — the end date must not be before the start date — something JSON Schema cannot express. The issue lands on the control referenced by the refinement path.',
  schema,
  schemaText: `z.object({
  title: z.string().min(1),
  startDate: z.string().describe('YYYY-MM-DD'),
  endDate: z.string().describe('YYYY-MM-DD'),
}).refine((trip) => trip.endDate >= trip.startDate, {
  path: ['endDate'],
  message: 'must not be before the start date',
})`,
  uischema: {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '/title' },
      {
        type: 'HorizontalLayout',
        elements: [
          { type: 'Control', scope: '/startDate' },
          { type: 'Control', scope: '/endDate' },
        ],
      },
    ],
  },
  data: {
    title: 'Hiking in the Alps',
    startDate: '2026-07-10',
    endDate: '2026-07-03',
  },
};
