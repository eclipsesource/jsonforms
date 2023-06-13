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

import cloneDeep from 'lodash/cloneDeep';
import setFp from 'lodash/fp/set';
import get from 'lodash/get';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import type Ajv from 'ajv';
import type { ErrorObject, ValidateFunction } from 'ajv';
import {
  CoreActions,
  INIT,
  InitAction,
  InitActionOptions,
  SET_AJV,
  SET_SCHEMA,
  SET_UISCHEMA,
  SET_VALIDATION_MODE,
  UPDATE_DATA,
  UPDATE_ERRORS,
  UPDATE_CORE,
  UpdateCoreAction,
} from '../actions';
import { createAjv, decode, isOneOfEnumSchema, Reducer } from '../util';
import type { JsonSchema, UISchemaElement } from '../models';

export const validate = (
  validator: ValidateFunction | undefined,
  data: any
): ErrorObject[] => {
  if (validator === undefined) {
    return [];
  }
  const valid = validator(data);
  if (valid) {
    return [];
  }
  return validator.errors;
};

export type ValidationMode =
  | 'ValidateAndShow'
  | 'ValidateAndHide'
  | 'NoValidation';

export interface JsonFormsCore {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  errors?: ErrorObject[];
  additionalErrors?: ErrorObject[];
  validator?: ValidateFunction;
  ajv?: Ajv;
  validationMode?: ValidationMode;
}

const initState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: undefined,
  ajv: undefined,
  validationMode: 'ValidateAndShow',
  additionalErrors: [],
};

const reuseAjvForSchema = (ajv: Ajv, schema: JsonSchema): Ajv => {
  if (
    Object.prototype.hasOwnProperty.call(schema, 'id') ||
    Object.prototype.hasOwnProperty.call(schema, '$id')
  ) {
    ajv.removeSchema(schema);
  }
  return ajv;
};

const getOrCreateAjv = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): Ajv => {
  if (action) {
    if (hasAjvOption(action.options)) {
      // options object with ajv
      return action.options.ajv;
    } else if (action.options !== undefined) {
      // it is not an option object => should be ajv itself => check for compile function
      if (isFunction(action.options.compile)) {
        return action.options;
      }
    }
  }
  if (state.ajv) {
    return action?.schema
      ? reuseAjvForSchema(state.ajv, action.schema)
      : state.ajv;
  }
  return createAjv();
};

const hasAjvOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.ajv !== undefined;
  }
  return false;
};

const getValidationMode = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): ValidationMode => {
  if (action && hasValidationModeOption(action.options)) {
    return action.options.validationMode;
  }
  return state.validationMode;
};

const hasValidationModeOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.validationMode !== undefined;
  }
  return false;
};

const hasAdditionalErrorsOption = (
  option: any
): option is InitActionOptions => {
  if (option) {
    return option.additionalErrors !== undefined;
  }
  return false;
};

const getAdditionalErrors = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): ErrorObject[] => {
  if (action && hasAdditionalErrorsOption(action.options)) {
    return action.options.additionalErrors;
  }
  return state.additionalErrors;
};

export const coreReducer: Reducer<JsonFormsCore, CoreActions> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);

      const validationMode = getValidationMode(state, action);
      const v =
        validationMode === 'NoValidation'
          ? undefined
          : thisAjv.compile(action.schema);
      const e = validate(v, action.data);
      const additionalErrors = getAdditionalErrors(state, action);

      return {
        ...state,
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        additionalErrors,
        errors: e,
        validator: v,
        ajv: thisAjv,
        validationMode,
      };
    }
    case UPDATE_CORE: {
      const thisAjv = getOrCreateAjv(state, action);
      const validationMode = getValidationMode(state, action);
      let validator = state.validator;
      let errors = state.errors;
      if (
        state.schema !== action.schema ||
        state.validationMode !== validationMode ||
        state.ajv !== thisAjv
      ) {
        // revalidate only if necessary
        validator =
          validationMode === 'NoValidation'
            ? undefined
            : thisAjv.compile(action.schema);
        errors = validate(validator, action.data);
      } else if (state.data !== action.data) {
        errors = validate(validator, action.data);
      }
      const additionalErrors = getAdditionalErrors(state, action);

      const stateChanged =
        state.data !== action.data ||
        state.schema !== action.schema ||
        state.uischema !== action.uischema ||
        state.ajv !== thisAjv ||
        state.errors !== errors ||
        state.validator !== validator ||
        state.validationMode !== validationMode ||
        state.additionalErrors !== additionalErrors;
      return stateChanged
        ? {
            ...state,
            data: action.data,
            schema: action.schema,
            uischema: action.uischema,
            ajv: thisAjv,
            errors: isEqual(errors, state.errors) ? state.errors : errors,
            validator: validator,
            validationMode: validationMode,
            additionalErrors,
          }
        : state;
    }
    case SET_AJV: {
      const currentAjv = action.ajv;
      const validator =
        state.validationMode === 'NoValidation'
          ? undefined
          : currentAjv.compile(state.schema);
      const errors = validate(validator, state.data);
      return {
        ...state,
        validator,
        errors,
      };
    }
    case SET_SCHEMA: {
      const needsNewValidator =
        action.schema && state.ajv && state.validationMode !== 'NoValidation';
      const v = needsNewValidator
        ? reuseAjvForSchema(state.ajv, action.schema).compile(action.schema)
        : state.validator;
      const errors = validate(v, state.data);
      return {
        ...state,
        validator: v,
        schema: action.schema,
        errors,
      };
    }
    case SET_UISCHEMA: {
      return {
        ...state,
        uischema: action.uischema,
      };
    }
    case UPDATE_DATA: {
      if (action.path === undefined || action.path === null) {
        return state;
      } else if (action.path === '') {
        // empty path is ok
        const result = action.updater(cloneDeep(state.data));
        const errors = validate(state.validator, result);
        return {
          ...state,
          data: result,
          errors,
        };
      } else {
        const oldData: any = get(state.data, action.path);
        const newData = action.updater(cloneDeep(oldData));
        const newState: any = setFp(
          action.path,
          newData,
          state.data === undefined ? {} : state.data
        );
        const errors = validate(state.validator, newState);
        return {
          ...state,
          data: newState,
          errors,
        };
      }
    }
    case UPDATE_ERRORS: {
      return {
        ...state,
        errors: action.errors,
      };
    }
    case SET_VALIDATION_MODE: {
      if (state.validationMode === action.validationMode) {
        return state;
      }
      if (action.validationMode === 'NoValidation') {
        const errors = validate(undefined, state.data);
        return {
          ...state,
          errors,
          validationMode: action.validationMode,
        };
      }
      if (state.validationMode === 'NoValidation') {
        const validator = reuseAjvForSchema(state.ajv, state.schema).compile(
          state.schema
        );
        const errors = validate(validator, state.data);
        return {
          ...state,
          validator,
          errors,
          validationMode: action.validationMode,
        };
      }
      return {
        ...state,
        validationMode: action.validationMode,
      };
    }
    default:
      return state;
  }
};

export const extractData = (state: JsonFormsCore) => get(state, 'data');
export const extractSchema = (state: JsonFormsCore) => get(state, 'schema');
export const extractUiSchema = (state: JsonFormsCore) => get(state, 'uischema');
export const extractAjv = (state: JsonFormsCore) => get(state, 'ajv');

const getInvalidProperty = (error: ErrorObject): string | undefined => {
  switch (error.keyword) {
    case 'required':
    case 'dependencies':
      return error.params.missingProperty;
    case 'additionalProperties':
      return error.params.additionalProperty;
    default:
      return undefined;
  }
};

export const getControlPath = (error: ErrorObject) => {
  // Up until AJV v7 the path property was called 'dataPath'
  // With AJV v8 the property was renamed to 'instancePath'
  let controlPath = (error as any).dataPath || error.instancePath || '';

  // change '/' chars to '.'
  controlPath = controlPath.replace(/\//g, '.');

  const invalidProperty = getInvalidProperty(error);
  if (invalidProperty !== undefined && !controlPath.endsWith(invalidProperty)) {
    controlPath = `${controlPath}.${invalidProperty}`;
  }

  // remove '.' chars at the beginning of paths
  controlPath = controlPath.replace(/^./, '');

  // decode JSON Pointer escape sequences
  controlPath = decode(controlPath);
  return controlPath;
};

export const errorsAt =
  (
    instancePath: string,
    schema: JsonSchema,
    matchPath: (path: string) => boolean
  ) =>
  (errors: ErrorObject[]): ErrorObject[] => {
    // Get data paths of oneOf and anyOf errors to later determine whether an error occurred inside a subschema of oneOf or anyOf.
    const combinatorPaths = filter(
      errors,
      (error) => error.keyword === 'oneOf' || error.keyword === 'anyOf'
    ).map((error) => getControlPath(error));

    return filter(errors, (error) => {
      // Filter errors that match any keyword that we don't want to show in the UI
      // but keep the errors for oneOf enums
      if (
        filteredErrorKeywords.indexOf(error.keyword) !== -1 &&
        !isOneOfEnumSchema(error.parentSchema)
      ) {
        return false;
      }
      const controlPath = getControlPath(error);
      let result = matchPath(controlPath);
      // In anyOf and oneOf blocks with "primitive" (i.e. string, number etc.) or array subschemas,
      // we want to make sure that errors are only shown for the correct subschema.
      // Therefore, we compare the error's parent schema with the property's schema.
      // In the primitive case the error's data path is the same for all subschemas:
      // It directly points to the property defining the anyOf/oneOf.
      // The same holds true for errors on the array level (e.g. min item amount).
      // In contrast, this comparison must not be done for errors whose parent schema defines an object or a oneOf enum,
      // because the parent schema can never match the property schema (e.g. for 'required' checks).
      const parentSchema: JsonSchema | undefined = error.parentSchema;
      if (
        result &&
        !isObjectSchema(parentSchema) &&
        !isOneOfEnumSchema(parentSchema) &&
        combinatorPaths.findIndex((p) => instancePath.startsWith(p)) !== -1
      ) {
        result = result && isEqual(parentSchema, schema);
      }
      return result;
    });
  };

/**
 * @returns true if the schema describes an object.
 */
const isObjectSchema = (schema?: JsonSchema): boolean => {
  return schema?.type === 'object' || !!schema?.properties;
};

/**
 * The error-type of an AJV error is defined by its `keyword` property.
 * Certain errors are filtered because they don't fit to any rendered control.
 * All of them have in common that we don't want to show them in the UI
 * because controls will show the actual reason why they don't match their correponding sub schema.
 * - additionalProperties: Indicates that a property is present that is not defined in the schema.
 *      Jsonforms only allows to edit defined properties. These errors occur if an oneOf doesn't match.
 * - allOf: Indicates that not all of the allOf definitions match as a whole.
 * - anyOf: Indicates that an anyOf definition itself is not valid because none of its subschemas matches.
 * - oneOf: Indicates that an oneOf definition itself is not valid because not exactly one of its subschemas matches.
 */
const filteredErrorKeywords = [
  'additionalProperties',
  'allOf',
  'anyOf',
  'oneOf',
];

const getErrorsAt =
  (
    instancePath: string,
    schema: JsonSchema,
    matchPath: (path: string) => boolean
  ) =>
  (state: JsonFormsCore): ErrorObject[] => {
    const errors = state.errors ?? [];
    const additionalErrors = state.additionalErrors ?? [];
    return errorsAt(
      instancePath,
      schema,
      matchPath
    )(
      state.validationMode === 'ValidateAndHide'
        ? additionalErrors
        : [...errors, ...additionalErrors]
    );
  };

export const errorAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, (path) => path === instancePath);
export const subErrorsAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, (path) =>
    path.startsWith(instancePath + '.')
  );
