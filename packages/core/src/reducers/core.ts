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
import unsetFp from 'lodash/fp/unset';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import {
  CoreActions,
  INIT,
  InitAction,
  InitActionOptions,
  SET_AJV,
  SET_SCHEMA,
  SET_UISCHEMA,
  SET_VALIDATION_MODE,
  UPDATE_CORE,
  UPDATE_DATA,
  UPDATE_ERRORS,
  UpdateCoreAction,
} from '../actions';
import { JsonFormsCore, Reducer, ValidationMode } from '../store';
import Ajv, { ErrorObject } from 'ajv';
import { isFunction } from 'lodash';
import { createAjv, validate } from '../util';

export const initState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: undefined,
  ajv: undefined,
  validationMode: 'ValidateAndShow',
  additionalErrors: [],
};

export const getValidationMode = (
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

export const getAdditionalErrors = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): ErrorObject[] => {
  if (action && hasAdditionalErrorsOption(action.options)) {
    return action.options.additionalErrors;
  }
  return state.additionalErrors;
};

export const getOrCreateAjv = (
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
  return state.ajv ? state.ajv : createAjv();
};

const hasAjvOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.ajv !== undefined;
  }
  return false;
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
        ? state.ajv.compile(action.schema)
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
        let newState: any;
        if (newData !== undefined) {
          newState = setFp(
            action.path,
            newData,
            state.data === undefined ? {} : state.data
          );
        } else {
          newState = unsetFp(
            action.path,
            state.data === undefined ? {} : state.data
          );
        }
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
        const validator = state.ajv.compile(state.schema);
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
