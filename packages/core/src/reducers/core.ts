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
import * as _ from 'lodash';
import * as AJV from 'ajv';
import { INIT, UPDATE_DATA } from '../actions';
import { ErrorObject, ValidateFunction } from 'ajv';

const ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');

const validate = (validator: ValidateFunction, data: any): ErrorObject[] => {
  const valid = validator(data);
  if (valid) {
    return [];
  }

  return validator.errors;
};

const sanitizeErrors = (validator, data) =>
  validate(validator, data).map(error => {
    error.dataPath = error.dataPath.replace(/\//g, '.').substr(1);

    return error;
  });

export const coreReducer = (
  state = {
    data: {} as any,
    schema: {},
    uischema: {},
    errors: [] as ErrorObject[],
    validator: () => true,
  },
  action) => {

  switch (action.type) {
    case INIT: {

      const v = ajv.compile(action.schema);
      const e = sanitizeErrors(v, action.data);

      return {
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        validator: v,
        errors: e
      };
    }
    case UPDATE_DATA: {

      if (action.path === undefined || action.path === null) {
        return state;
      } else if (action.path === '') {
        // empty path is ok
        const result = action.updater(state.data);

        if (result === undefined || result === null) {
          return {
            data: state.data,
            uischema: state.uischema,
            schema: state.schema
          };
        }

        const errors = sanitizeErrors(state.validator, result);

        return {
          data: result,
          uischema: state.uischema,
          schema: state.schema,
          validator: state.validator,
          errors
        };
      } else {
        const oldData: any = _.get(state.data, action.path);
        const newData = action.updater(oldData);
        const newState: any = _.set(_.cloneDeep(state.data), action.path, newData);
        const errors = sanitizeErrors(state.validator, newState);

        return {
          data: newState,
          uischema: state.uischema,
          schema: state.schema,
          validator: state.validator,
          errors
        };
      }
    }
    default:
      return state;
  }
};

export const extractData = state => state.data;
export const extractSchema = state => state.schema;
export const extractUiSchema = state => state.uischema;
export const errorAt = instancePath => (state): any[] => {
  return _.filter(state.errors, (error: ErrorObject) => error.dataPath === instancePath);
};
export const subErrorsAt = instancePath => (state): any[] => {
  const path = `${instancePath}.`;

  return _.filter(state.errors, (error: ErrorObject) => error.dataPath.startsWith(path));
};
