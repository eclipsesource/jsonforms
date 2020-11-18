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
import set from 'lodash/set';
import get from 'lodash/get';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import { Ajv, ErrorObject, ValidateFunction } from 'ajv';
import RefParser from 'json-schema-ref-parser';
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
  UpdateCoreAction
} from '../actions';
import { createAjv } from '../util/validator';
import { Reducer } from '../util/type';
import { JsonSchema, UISchemaElement } from '..';

const validate = (validator: ValidateFunction, data: any): ErrorObject[] => {
  const valid = validator(data);
  if (valid) {
    return [];
  }

  return validator.errors;
};

export const sanitizeErrors = (validator: ValidateFunction, data: any) => {
  if (validator === alwaysValid) {
    return [];
  }
  return validate(validator, data).map(error => {
    error.dataPath = error.dataPath.replace(/\//g, '.').substr(1);

    return error;
  });
};

const alwaysValid: ValidateFunction = () => true;

export type ValidationMode = 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';

export interface JsonFormsCore {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  errors?: ErrorObject[];
  validator?: ValidateFunction;
  ajv?: Ajv;
  refParserOptions?: RefParser.Options;
  validationMode?: ValidationMode;
}

const initState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: alwaysValid,
  ajv: undefined,
  refParserOptions: undefined,
  validationMode: 'ValidateAndShow'
};

const reuseAjvForSchema = (ajv: Ajv, schema: JsonSchema): Ajv => {
  if (schema.hasOwnProperty('id') || schema.hasOwnProperty('$id')) {
    ajv.removeSchema(schema);
  }
  return ajv;
};

const getOrCreateAjv = (state: JsonFormsCore, action?: InitAction | UpdateCoreAction): Ajv => {
  if (action) {
    if (hasAjvOption(action.options)) {
      // options object with ajv
      return action.options.ajv;
    } else if (
      action.options !== undefined &&
      !hasRefParserOption(action.options)
    ) {
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

const getRefParserOptions = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): RefParser.Options => {
  if (action && hasRefParserOption(action.options)) {
    return action.options.refParserOptions;
  }
  return state.refParserOptions;
};

const hasRefParserOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.refParserOptions !== undefined;
  }
  return false;
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

// tslint:disable-next-line: cyclomatic-complexity
export const coreReducer: Reducer<JsonFormsCore, CoreActions> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);
      const o = getRefParserOptions(state, action);

      const validationMode = getValidationMode(state, action);
      const v = validationMode === 'NoValidation' ? alwaysValid : thisAjv.compile(action.schema);
      const e = sanitizeErrors(v, action.data);

      return {
        ...state,
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        errors: e,
        validator: v,
        ajv: thisAjv,
        refParserOptions: o,
        validationMode
      };
    }
    case UPDATE_CORE: {
      const thisAjv = getOrCreateAjv(state, action);
      const refParserOptions = getRefParserOptions(state, action);
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
            ? alwaysValid
            : thisAjv.compile(action.schema);
        errors = sanitizeErrors(validator, action.data);
      } else if (state.data !== action.data) {
        errors = sanitizeErrors(validator, action.data);
      }

      const stateChanged =
        state.data !== action.data ||
        state.schema !== action.schema ||
        state.uischema !== action.uischema ||
        state.ajv !== thisAjv ||
        state.errors !== errors ||
        state.validator !== validator ||
        state.refParserOptions !== refParserOptions ||
        state.validationMode !== validationMode;
      return stateChanged
        ? {
            ...state,
            data: state.data === action.data ? state.data : action.data,
            schema: state.schema === action.schema ? state.schema : action.schema,
            uischema: state.uischema === action.uischema ? state.uischema : action.uischema,
            ajv: thisAjv === state.ajv ? state.ajv : thisAjv,
            errors: isEqual(errors, state.errors) ? state.errors : errors,
            validator: validator === state.validator ? state.validator : validator,
            refParserOptions: refParserOptions === state.refParserOptions ? state.refParserOptions : refParserOptions,
            validationMode: validationMode === state.validationMode ? state.validationMode : validationMode
          }
        : state;
    }
    case SET_AJV: {
      const currentAjv = action.ajv;
      const validator = state.validationMode === 'NoValidation' ? alwaysValid : currentAjv.compile(state.schema);
      const errors = sanitizeErrors(validator, state.data);
      return {
        ...state,
        validator,
        errors
      };
    }
    case SET_SCHEMA: {
      const needsNewValidator = action.schema && state.ajv && state.validationMode !== 'NoValidation';
      const v = needsNewValidator
        ? reuseAjvForSchema(state.ajv, action.schema).compile(action.schema)
        : state.validator;
      const errors = sanitizeErrors(v, state.data);
      return {
        ...state,
        validator: v,
        schema: action.schema,
        errors
      };
    }
    case SET_UISCHEMA: {
      return {
        ...state,
        uischema: action.uischema
      };
    }
    case UPDATE_DATA: {
      if (action.path === undefined || action.path === null) {
        return state;
      } else if (action.path === '') {
        // empty path is ok
        const result = action.updater(cloneDeep(state.data));

        const errors = sanitizeErrors(state.validator, result);

        return {
          ...state,
          data: result,
          errors
        };
      } else {
        const oldData: any = get(state.data, action.path);
        const newData = action.updater(cloneDeep(oldData));
        const newState: any = set(state.data === undefined ? {} : cloneDeep(state.data), action.path, newData);
        const errors = sanitizeErrors(state.validator, newState);

        return {
          ...state,
          data: newState,
          errors
        };
      }
    }
    case UPDATE_ERRORS: {
      return {
        ...state,
        errors: action.errors
      };
    }
    case SET_VALIDATION_MODE: {
      if (state.validationMode === action.validationMode) {
        return state;
      }
      if (action.validationMode === 'NoValidation') {
        const errors = sanitizeErrors(alwaysValid, state.data);
        return {
          ...state,
          validator: alwaysValid,
          errors,
          validationMode: action.validationMode
        };
      }
      if (state.validationMode === 'NoValidation') {
        const validator = reuseAjvForSchema(state.ajv, state.schema).compile(state.schema);
        const errors = sanitizeErrors(validator, state.data);
        return {
          ...state,
          validator,
          errors,
          validationMode: action.validationMode
        };
      }
      return {
        ...state,
        validationMode: action.validationMode
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

export const errorsAt = (
  instancePath: string,
  schema: JsonSchema,
  matchPath: (path: string) => boolean
) => (errors: ErrorObject[]): ErrorObject[] => {
  const combinatorPaths = filter(
    errors,
    error => error.keyword === 'oneOf' || error.keyword === 'anyOf'
  ).map(error => error.dataPath);

  return filter(errors, error => {
    let result = matchPath(error.dataPath);
    if (combinatorPaths.findIndex(p => instancePath.startsWith(p)) !== -1) {
      result = result && isEqual(error.parentSchema, schema);
    }
    return result;
  });
};

const getErrorsAt = (
  instancePath: string,
  schema: JsonSchema,
  matchPath: (path: string) => boolean
) => (state: JsonFormsCore): ErrorObject[] =>
  errorsAt(instancePath, schema, matchPath)(state.validationMode === 'ValidateAndHide' ? [] : state.errors);

export const errorAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, path => path === instancePath);
export const subErrorsAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, path => path.startsWith(instancePath));

export const extractRefParserOptions = (state: JsonFormsCore) =>
  get(state, 'refParserOptions');
