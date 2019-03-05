/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { Ajv, ErrorObject, ValidateFunction } from 'ajv';
import {
  INIT,
  InitAction,
  SET_AJV,
  SET_SCHEMA,
  SET_UISCHEMA,
  SetAjvAction,
  SetSchemaAction,
  SetUISchemaAction,
  UPDATE_DATA,
  UpdateAction
} from '../actions';
import { createAjv } from '../util/validator';
import { JsonSchema, UISchemaElement } from '..';

const validate = (validator: ValidateFunction, data: any): ErrorObject[] => {
  const valid = validator(data);
  if (valid) {
    return [];
  }

  return validator.errors;
};

const sanitizeErrors = (validator: ValidateFunction, data: any) =>
  validate(validator, data).map(error => {
    error.dataPath = error.dataPath.replace(/\//g, '.').substr(1);

    return error;
  });

const alwaysValid: ValidateFunction = () => true;

export interface JsonFormsCore {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  errors?: ErrorObject[];
  validator?: ValidateFunction;
  ajv?: Ajv;
}

const initState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: alwaysValid,
  ajv: undefined
};

type ValidCoreActions =
  | InitAction
  | UpdateAction
  | SetAjvAction
  | SetSchemaAction
  | SetUISchemaAction;

const getOrCreateAjv = (state: JsonFormsCore, action?: InitAction): Ajv => {
  if (action && action.ajv) {
    return action.ajv;
  }
  if (state.ajv) {
    return state.ajv;
  }
  return createAjv();
};

export const coreReducer = (
  state: JsonFormsCore = initState,
  action: ValidCoreActions
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);
      const v = thisAjv.compile(action.schema);
      const e = sanitizeErrors(v, action.data);

      return {
        ...state,
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        errors: e,
        validator: v,
        ajv: thisAjv
      };
    }
    case SET_AJV: {
      const currentAjv = action.ajv;
      const validator = currentAjv.compile(state.schema);
      const errors = sanitizeErrors(validator, state.data);
      return {
        ...state,
        validator,
        errors
      };
    }
    case SET_SCHEMA: {
      const v =
        action.schema && state.ajv
          ? state.ajv.compile(action.schema)
          : state.validator;
      return {
        ...state,
        validator: v,
        schema: action.schema
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

        if (result === undefined || result === null) {
          return {
            ...state,
            data: state.data,
            uischema: state.uischema,
            schema: state.schema
          };
        }

        const errors = sanitizeErrors(state.validator, result);

        return {
          ...state,
          data: result,
          errors
        };
      } else {
        const oldData: any = get(state.data, action.path);
        let newData = action.updater(oldData);
        if (newData === '') {
          newData = undefined;
        }

        const newState: any = set(cloneDeep(state.data), action.path, newData);
        const errors = sanitizeErrors(state.validator, newState);

        return {
          ...state,
          data: newState,
          errors
        };
      }
    }
    default:
      return state;
  }
};

export const extractData = (state: JsonFormsCore) => get(state, 'data');
export const extractSchema = (state: JsonFormsCore) => get(state, 'schema');
export const extractUiSchema = (state: JsonFormsCore) => get(state, 'uischema');
export const errorAt = (instancePath: string) => (
  state: JsonFormsCore
): ErrorObject[] => {
  return filter(
    state.errors,
    (error: ErrorObject) => error.dataPath === instancePath
  );
};
export const subErrorsAt = (instancePath: string) => (
  state: JsonFormsCore
): any[] => {
  const path = `${instancePath}.`;

  return filter(state.errors, (error: ErrorObject) =>
    error.dataPath.startsWith(path)
  );
};
