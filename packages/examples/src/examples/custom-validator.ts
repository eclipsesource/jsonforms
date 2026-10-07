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
import type {
  FormValidatorFactory,
  JsonSchema,
  UISchemaElement,
  ValidationIssue,
} from '@jsonforms/core';
import { registerExamples } from '../register';

export const schema: JsonSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description: 'Lowercase letters only, checked by the custom validator',
    },
    email: {
      type: 'string',
      description: 'Must contain a dot, checked by the custom validator',
    },
    newsletter: {
      type: 'boolean',
    },
    frequency: {
      type: 'string',
      enum: ['daily', 'weekly', 'monthly'],
    },
  },
  required: ['username'],
};

export const uischema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/username' },
    { type: 'Control', scope: '#/properties/email' },
    { type: 'Control', scope: '#/properties/newsletter' },
    {
      type: 'Control',
      scope: '#/properties/frequency',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/newsletter',
          schema: { const: true },
        },
      },
    },
  ],
} as UISchemaElement;

export const data = {
  username: 'Ada Lovelace',
  email: 'ada@example',
  newsletter: true,
};

/**
 * A Form Validator written by hand, without any validation library: it
 * checks `required`, that string values are lowercase and that an `email`
 * contains a dot. It compiles nothing and evaluates nothing, so it also works
 * under a Content Security Policy without `unsafe-eval`.
 *
 * It has no `matches`, so the rule on `frequency` is evaluated by core's
 * Structural Matcher.
 */
export const createHandwrittenValidator: FormValidatorFactory = (
  formSchema
) => ({
  validate: (formData) => {
    const issues: ValidationIssue[] = [];
    const values = (formData ?? {}) as Record<string, unknown>;
    for (const key of formSchema.required ?? []) {
      if (values[key] === undefined || values[key] === '') {
        issues.push({
          path: '',
          key: 'required',
          message: 'is a required property',
          params: { missingProperty: key },
        });
      }
    }
    for (const [key, propertySchema] of Object.entries(
      formSchema.properties ?? {}
    )) {
      const value = values[key];
      if (propertySchema.type !== 'string' || typeof value !== 'string') {
        continue;
      }
      if (value !== value.toLowerCase()) {
        issues.push({
          path: `/${key}`,
          key: 'lowercase',
          message: 'must be lowercase',
        });
      }
      if (key === 'email' && value !== '' && !value.includes('.')) {
        issues.push({
          path: `/${key}`,
          key: 'format',
          message: 'must contain a dot',
        });
      }
    }
    return issues;
  },
});

registerExamples([
  {
    name: 'custom-validator',
    label: 'Custom validator',
    data,
    schema,
    uischema,
    validator: createHandwrittenValidator,
  },
]);
