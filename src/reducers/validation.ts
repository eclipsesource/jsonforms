import * as AJV from 'ajv';
import * as _ from 'lodash';
import { ErrorObject, ValidateFunction } from 'ajv';
import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { INIT, VALIDATE } from '../actions';
const ajv = new AJV({allErrors: true, jsonPointers: true, errorDataPath: 'property'});

const validate = (validator: ValidateFunction, data: any): ErrorObject[] => {
  const valid = validator(data);
  if (valid) {
    return;
  }

  return validator.errors;
};

export interface ValidationState {
  uiSchema: UISchemaElement;
  errors: ErrorObject[];
  validator: ValidateFunction;
  schema: JsonSchema;
}

export const validationReducer = (
  state: ValidationState = {
    uiSchema: {} as UISchemaElement,
    errors: [] as ErrorObject[],
    validator: () => true,
    schema: {} as JsonSchema
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

      const errs = validate(validator, action.data);

      const errors = (errs || []).map(error => {
        error.dataPath = error.dataPath.replace('/', '.').substr(1);

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
  const x = _.filter(state.errors, (error: ErrorObject) => error.dataPath === instancePath);

  return _.filter(state.errors, (error: ErrorObject) => error.dataPath === instancePath);
};
