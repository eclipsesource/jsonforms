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

import type { ControlElement, JsonSchema, UISchemaElement } from '../models';
import { findUISchema } from '../reducers';
import { JsonFormsUISchemaRegistryEntry } from '../store';
import { Resolve } from '../util/util';

export interface CombinatorSubSchemaRenderInfo {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

export type CombinatorKeyword = 'anyOf' | 'oneOf' | 'allOf';

/** Custom schema keyword to define the property identifying different combinator schemas. */
export const COMBINATOR_TYPE_PROPERTY = 'x-jsf-type-property';

/** Default properties that are used to identify combinator schemas. */
export const COMBINATOR_IDENTIFICATION_PROPERTIES = ['type', 'kind'];

export const createCombinatorRenderInfos = (
  combinatorSubSchemas: JsonSchema[],
  rootSchema: JsonSchema,
  keyword: CombinatorKeyword,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[]
): CombinatorSubSchemaRenderInfo[] =>
  combinatorSubSchemas.map((subSchema, subSchemaIndex) => {
    const resolvedSubSchema =
      subSchema.$ref && Resolve.schema(rootSchema, subSchema.$ref, rootSchema);

    const schema = resolvedSubSchema ?? subSchema;

    return {
      schema,
      uischema: findUISchema(
        uischemas,
        schema,
        control.scope,
        path,
        undefined,
        control,
        rootSchema
      ),
      label:
        subSchema.title ??
        resolvedSubSchema?.title ??
        `${keyword}-${subSchemaIndex}`,
    };
  });

/**
 * Returns the index of the schema in the given combinator keyword that matches the identification property of the given data object.
 * The heuristic only works for data objects with a corresponding schema. If the data is a primitive value or an array, the heuristic does not work.
 *
 * The following heuristics are applied:
 * If the schema defines a `x-jsf-type-property`, it is used as the identification property.
 * Otherwise, the first of the following properties is used if it exists in at least one combinator schema and has a `const` entry:
 * - `type`
 * - `kind`
 *
 * If the index cannot be determined, `-1` is returned.
 *
 * @returns the index of the fitting schema or `-1` if no fitting schema was found
 */
export const getCombinatorIndexOfFittingSchema = (
  data: any,
  keyword: CombinatorKeyword,
  schema: JsonSchema,
  rootSchema: JsonSchema
): number => {
  if (typeof data !== 'object' || data === null) {
    return -1;
  }

  // Resolve all schemas in the combinator.
  const resolvedCombinatorSchemas = [];
  for (let i = 0; i < schema[keyword]?.length; i++) {
    let resolvedSchema = schema[keyword][i];
    if (resolvedSchema.$ref) {
      resolvedSchema = Resolve.schema(
        rootSchema,
        resolvedSchema.$ref,
        rootSchema
      );
    }
    resolvedCombinatorSchemas.push(resolvedSchema);
  }

  // Determine the identification property
  let idProperty: string | undefined;
  if (
    COMBINATOR_TYPE_PROPERTY in schema &&
    typeof schema[COMBINATOR_TYPE_PROPERTY] === 'string'
  ) {
    idProperty = schema[COMBINATOR_TYPE_PROPERTY];
  } else {
    // Use the first default identification property that has a const entry in at least one of the schemas
    for (const potentialIdProp of COMBINATOR_IDENTIFICATION_PROPERTIES) {
      for (const resolvedSchema of resolvedCombinatorSchemas) {
        if (resolvedSchema.properties?.[potentialIdProp]?.const !== undefined) {
          idProperty = potentialIdProp;
          break;
        }
      }
    }
  }

  let indexOfFittingSchema = -1;
  if (idProperty === undefined) {
    return indexOfFittingSchema;
  }

  // Check if the data matches the identification property of one of the resolved schemas
  for (let i = 0; i < resolvedCombinatorSchemas.length; i++) {
    const resolvedSchema = resolvedCombinatorSchemas[i];

    // Match the identification property against a constant value in resolvedSchema
    const maybeConstIdValue = resolvedSchema.properties?.[idProperty]?.const;

    if (
      maybeConstIdValue !== undefined &&
      data[idProperty] === maybeConstIdValue
    ) {
      indexOfFittingSchema = i;
      break;
    }
  }

  return indexOfFittingSchema;
};
