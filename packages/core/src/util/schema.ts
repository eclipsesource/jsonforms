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

import find from 'lodash/find';
import type { JsonSchema } from '../models';

export const getFirstPrimitiveProp = (schema: unknown) => {
  if (
    schema &&
    typeof schema === 'object' &&
    'properties' in schema &&
    schema.properties
  ) {
    return find(
      Object.keys(schema.properties),
      (propName: keyof typeof schema.properties) => {
        const prop: unknown = schema.properties[propName];
        return (
          prop &&
          typeof prop === 'object' &&
          'type' in prop &&
          (prop.type === 'string' ||
            prop.type === 'number' ||
            prop.type === 'integer')
        );
      }
    );
  }
  return undefined;
};

/**
 * Tests whether the schema has an enum based on oneOf.
 */
export const isOneOfEnumSchema = (schema: JsonSchema) =>
  !!schema &&
  Object.prototype.hasOwnProperty.call(schema, 'oneOf') &&
  schema.oneOf &&
  (schema.oneOf as JsonSchema[]).every((s) => s.const !== undefined);

/**
 * Tests whether the schema has an enum.
 */
export const isEnumSchema = (schema: JsonSchema) =>
  !!schema &&
  typeof schema === 'object' &&
  (Object.prototype.hasOwnProperty.call(schema, 'enum') ||
    Object.prototype.hasOwnProperty.call(schema, 'const'));
