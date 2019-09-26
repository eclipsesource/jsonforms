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

import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, UISchemaElement } from '../models/uischema';
import { findUISchema, UISchemaTester } from '../reducers';
import { Ajv, ErrorObject } from 'ajv';

export interface CombinatorSubSchemaRenderInfo {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

export type CombinatorKeyword = 'anyOf' | 'oneOf' | 'allOf';

const createLabel = (
  subSchema: JsonSchema,
  subSchemaIndex: number,
  keyword: CombinatorKeyword
): string => {
  if (subSchema.title) {
    return subSchema.title;
  } else {
    return `${keyword}-${subSchemaIndex}`;
  }
};

export const createCombinatorRenderInfos = (
  combinatorSubSchemas: JsonSchema[],
  rootSchema: JsonSchema,
  keyword: CombinatorKeyword,
  control: ControlElement,
  path: string,
  uischemas: { tester: UISchemaTester; uischema: UISchemaElement }[]
): CombinatorSubSchemaRenderInfo[] => {
  return combinatorSubSchemas.map((subSchema, subSchemaIndex) => ({
    schema: subSchema,
    uischema: findUISchema(
      uischemas,
      subSchema,
      `${control.scope}/${keyword}/${subSchemaIndex}`,
      path,
      undefined,
      control,
      rootSchema
    ),
    label: createLabel(subSchema, subSchemaIndex, keyword)
  }));
};

export const findApplicableSchema = async (
  ajv: Ajv,
  data: any,
  subschemas: JsonSchema[],
  refResolver: any
): Promise<number> => {
  let indexOfFittingSchema = 0;
  const structuralKeywords = [
    'required',
    'additionalProperties',
    'type',
    'enum'
  ];
  const dataIsValid = (errors: ErrorObject[]): boolean => {
    return (
      !errors ||
      errors.length === 0 ||
      !errors.find(e => structuralKeywords.indexOf(e.keyword) !== -1)
    );
  };
  try {
    const resolvedSubSchemas = await Promise.all(
      subschemas.map(sub => {
        if (sub.$ref) {
          return refResolver(sub.$ref);
        }
        return sub;
      })
    );
    for (let i = 0; i < resolvedSubSchemas.length; i++) {
      const valFn = ajv.compile(resolvedSubSchemas[i]);
      valFn(data);
      if (dataIsValid(valFn.errors)) {
        indexOfFittingSchema = i;
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return indexOfFittingSchema;
};
