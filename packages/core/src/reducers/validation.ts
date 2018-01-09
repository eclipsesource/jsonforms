import * as AJV from 'ajv';
import * as _ from 'lodash';
import { ErrorObject, ValidateFunction } from 'ajv';
import { JsonSchema } from '../models/jsonSchema';
import { INIT, VALIDATE } from '../actions';
const ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');

const validate = (validator: ValidateFunction, data: any): ErrorObject[] => {
  const valid = validator(data);
  if (valid) {
    return [];
  }

  return validator.errors;
};

export interface ValidationState {
  errors: ErrorObject[];
  validator: ValidateFunction;
  schema: JsonSchema;
}

export const validationReducer = (
  state: ValidationState = {
    errors: [] as ErrorObject[],
    validator: () => true,
    schema: {}
  },
  action): ValidationState => {

  switch (action.type) {
    // TODO: review use of actions
    case INIT:
      return {
        ...state,
        schema: action.schema,
        validator: ajv.compile(action.schema)
      };
    case VALIDATE:
      let validator = state.validator;
      if (validator === undefined) {
        validator = ajv.compile(state.schema);
      }

      const errors = validate(validator, action.data).map(error => {
        error.dataPath = error.dataPath.replace(/\//g, '.').substr(1);

        return error;
      });

      return {
        ...state,
        validator,
        errors
      };
    default:
      return state;
  }
};

export const errorAt = instancePath => (state): any[] => {
  return _.filter(state.errors, (error: ErrorObject) => error.dataPath === instancePath);
};
export const subErrorsAt = instancePath => (state): any[] => {
  const path = instancePath + '.';

  return _.filter(state.errors, (error: ErrorObject) => error.dataPath.startsWith(path));
};
