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
import type Ajv from 'ajv';
import type { ErrorObject, ValidateFunction } from 'ajv';
import type { JsonSchema } from '../models';
import { createAjv } from './validator';
import { decode } from './path';

/** A validation finding, addressed to a data location by JSON Pointer. */
export interface ValidationIssue {
  /** JSON Pointer of the invalid value, e.g. `/address/street`. */
  path: string;
  /** Kind of issue, e.g. the JSON Schema keyword. Defaults to `custom`. */
  key?: string;
  message: string;
  /** Keyword parameters, e.g. `{ missingProperty: 'name' }`. */
  params?: Record<string, unknown>;
  /** The schema the issue was raised against. */
  parentSchema?: JsonSchema;
}

/** Validates form data against the schema it was created for. */
export interface FormValidator {
  validate: (data: unknown) => readonly ValidationIssue[];
}

/** Creates the Form Validator for a schema. */
export type FormValidatorFactory = (schema: JsonSchema) => FormValidator;

const ajvErrorsToIssues = (
  errors: readonly ErrorObject[] | null | undefined
): ValidationIssue[] =>
  (errors ?? []).map(
    ({ instancePath, keyword, ...rest }) =>
      ({ ...rest, path: instancePath, key: keyword } as ValidationIssue)
  );

/**
 * Wraps an already compiled Ajv validate function, e.g. generated via Ajv
 * standalone code.
 */
export const compiledAjvValidator = (
  validateFn: ValidateFunction
): FormValidator => ({
  validate: (data) => {
    validateFn(data);
    return ajvErrorsToIssues(validateFn.errors);
  },
});

/** Creates Form Validators backed by the given Ajv instance. */
export const createAjvValidator =
  (ajv: Ajv = createAjv()): FormValidatorFactory =>
  (schema) =>
    compiledAjvValidator(ajv.compile(schema));

/** Converts issues to the Ajv error objects stored in the state. */
export const issuesToErrors = (
  issues: readonly ValidationIssue[]
): ErrorObject[] =>
  issues.map(({ path, key, params, ...rest }) => {
    let instancePath = path;
    const keyword = key ?? 'custom';
    const errorParams: Record<string, unknown> = { ...params };
    // A `required` issue addressed to the missing property itself
    if (
      keyword === 'required' &&
      errorParams.missingProperty === undefined &&
      instancePath.startsWith('/')
    ) {
      const cut = instancePath.lastIndexOf('/');
      errorParams.missingProperty = decode(instancePath.slice(cut + 1));
      instancePath = instancePath.slice(0, cut);
    }
    return {
      schemaPath: '',
      ...rest,
      instancePath,
      keyword,
      params: errorParams,
    } as ErrorObject;
  });
