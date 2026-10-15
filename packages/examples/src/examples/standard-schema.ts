/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import * as v from 'valibot';
import { toStandardJsonSchema } from '@valibot/to-json-schema';
import { fromStandardSchema } from '@jsonforms/standard-schema';
import type { UISchemaElement } from '@jsonforms/core';
import { registerExamples } from '../register';

/**
 * The schema is written in Valibot. JSON Forms renders from the JSON Schema
 * derived through Standard JSON Schema and validates with Valibot itself, so
 * no schema is compiled at runtime and the form works under a Content
 * Security Policy without `unsafe-eval`.
 */
export const valibotSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2),
    v.description('At least two characters, checked by Valibot')
  ),
  email: v.pipe(v.string(), v.email()),
  age: v.optional(v.pipe(v.number(), v.integer(), v.minValue(18))),
  plan: v.picklist(['free', 'team', 'enterprise']),
  seats: v.optional(v.pipe(v.number(), v.integer(), v.minValue(2))),
});

const form = fromStandardSchema(valibotSchema, {
  jsonSchema: toStandardJsonSchema(valibotSchema),
});

export const schema = form.jsonSchema;
export const validator = form.validator;

export const uischema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/name' },
    { type: 'Control', scope: '#/properties/email' },
    { type: 'Control', scope: '#/properties/age' },
    { type: 'Control', scope: '#/properties/plan' },
    {
      type: 'Control',
      scope: '#/properties/seats',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/plan',
          schema: { enum: ['team', 'enterprise'] },
        },
      },
    },
  ],
} as UISchemaElement;

export const data = {
  name: 'A',
  email: 'ada@example',
  age: 17,
  plan: 'team',
  seats: 1,
};

registerExamples([
  {
    name: 'standard-schema',
    label: 'Standard Schema (Valibot)',
    data,
    schema,
    uischema,
    validator,
  },
]);
