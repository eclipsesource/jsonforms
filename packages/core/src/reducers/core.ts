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
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import isFunction from 'lodash/isFunction';
import {
  createAjv,
  validate,
  findControlForProperty,
  hasRequiredRule,
  isRequired,
  hasValueRule,
  evalValue,
  hasShowRule,
  isVisible,
} from '../util';
import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement, SchemaBasedCondition } from '../models';

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

const createDynamicSchema = (
  schema: JsonSchema,
  uischema: UISchemaElement,
  data: any,
  ajv: Ajv
): { schema: JsonSchema; updatedData: any } => {
  if (!schema.properties) {
    return { schema, updatedData: data };
  }

  // Start with existing required fields or empty array
  const requiredFields = Array.isArray(schema.required)
    ? [...schema.required]
    : [];

  // Track if anything actually changes
  let requiredChanged = false;
  let dataChanged = false;

  // Start with references to original objects
  let updatedData = data;

  const getConditionPath = (
    control: any,
    key: string
  ): { condition: SchemaBasedCondition; path: string | undefined } => {
    const condition = control.rule?.condition as SchemaBasedCondition;
    const isSchemaCondition = condition && 'schema' in condition;
    // For schema-based conditions with scope: "#", we need to pass undefined as path
    // This is because the condition is evaluated against the root of the data
    // and we want to ensure that the field is required if the condition is met
    const path = isSchemaCondition && condition.scope === '#' ? undefined : key;
    return { condition, path };
  };

  // Check each property for dynamic required rules and value rules
  Object.keys(schema.properties).forEach((key) => {
    const control = findControlForProperty(uischema, key);
    if (control) {
      const { path } = getConditionPath(control, key);
      if (hasRequiredRule(control)) {
        const isFieldRequired = isRequired(control, data, path, ajv);
        const fieldIndex = requiredFields.indexOf(key);

        if (isFieldRequired && !requiredFields.includes(key)) {
          // Add to required if not already there
          requiredFields.push(key);
          requiredChanged = true;
        } else if (!isFieldRequired && requiredFields.includes(key)) {
          // Remove from required if no longer required
          requiredFields.splice(fieldIndex, 1);
          requiredChanged = true;
        }
      }

      if (hasValueRule(control) && data !== undefined) {
        const { shouldUpdate, newValue } = evalValue(control, data, path, ajv);
        if (shouldUpdate) {
          // Only create a copy if we haven't already
          if (!dataChanged) {
            updatedData = { ...data };
            dataChanged = true;
          }
          updatedData = setFp(key, newValue, updatedData);
        }
      }

      // Handle visibility rules - clear values for hidden fields
      if (hasShowRule(control) && data !== undefined) {
        // Check if the field is hidden
        const isFieldVisible = isVisible(control, data, path, ajv);

        // If field is hidden and has a value, and preserveValueOnHide is not true, clear it
        if (
          !isFieldVisible &&
          data[key] !== undefined &&
          !control.rule?.options?.preserveValueOnHide
        ) {
          // Only create a copy if we haven't already
          if (!dataChanged) {
            updatedData = { ...data };
            dataChanged = true;
          }
          // Clear the value (set to undefined)
          updatedData = setFp(key, undefined, updatedData);
        }
      }
    }
  });

  const newRequired = requiredFields.length > 0 ? requiredFields : undefined;
  const requiredEqual = isEqual(schema.required, newRequired);

  // If nothing changed, return original references
  if ((!requiredChanged || requiredEqual) && !dataChanged) {
    return { schema, updatedData: data };
  }

  // If only data changed, keep schema reference
  if (!requiredChanged || requiredEqual) {
    return { schema, updatedData };
  }

  // If only required changed, create minimal schema update
  return {
    schema: {
      ...schema,
      required: newRequired,
    },
    updatedData,
  };
};

export const coreReducer: Reducer<JsonFormsCore, CoreActions> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);
      const validationMode = getValidationMode(state, action);

      // Create dynamic schema with UI-based required fields
      const { schema: dynamicSchema, updatedData } = createDynamicSchema(
        action.schema,
        action.uischema,
        action.data,
        thisAjv
      );

      const v =
        validationMode === 'NoValidation'
          ? undefined
          : thisAjv.compile(dynamicSchema);
      const e = validate(v, updatedData);
      const additionalErrors = getAdditionalErrors(state, action);

      return {
        ...state,
        data: updatedData,
        schema: dynamicSchema,
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

      // Create dynamic schema with UI-based required fields
      const { schema: dynamicSchema, updatedData } = createDynamicSchema(
        action.schema,
        action.uischema,
        action.data,
        thisAjv
      );

      if (
        state.schema !== action.schema ||
        state.validationMode !== validationMode ||
        state.ajv !== thisAjv
      ) {
        validator =
          validationMode === 'NoValidation'
            ? undefined
            : thisAjv.compile(dynamicSchema);
        errors = validate(validator, updatedData);
      } else if (state.data !== action.data) {
        // Recompile with new dynamic schema since required status might have changed
        validator = thisAjv.compile(dynamicSchema);
        errors = validate(validator, updatedData);
      }
      const additionalErrors = getAdditionalErrors(state, action);

      // First check reference equality for performance
      const dataChanged = updatedData !== state.data;
      const schemaChanged = dynamicSchema !== state.schema;
      const uiSchemaChanged = action.uischema !== state.uischema;
      const errorsChanged = errors !== state.errors;
      const additionalErrorsChanged =
        additionalErrors !== state.additionalErrors;

      // Only do deep equality checks if reference equality fails
      const stateChanged =
        (dataChanged && !isEqual(updatedData, state.data)) ||
        (schemaChanged && !isEqual(dynamicSchema, state.schema)) ||
        (uiSchemaChanged && !isEqual(action.uischema, state.uischema)) ||
        thisAjv !== state.ajv ||
        (errorsChanged && !isEqual(errors, state.errors)) ||
        validator !== state.validator ||
        validationMode !== state.validationMode ||
        (additionalErrorsChanged &&
          !isEqual(additionalErrors, state.additionalErrors));

      return stateChanged
        ? {
            ...state,
            data: updatedData,
            schema: dynamicSchema,
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

        // Create dynamic schema with UI-based required fields and clear hidden fields
        const { schema: dynamicSchema, updatedData } = createDynamicSchema(
          state.schema,
          state.uischema,
          result,
          state.ajv
        );

        const errors = validate(state.validator, updatedData);

        return {
          ...state,
          data: updatedData,
          schema: dynamicSchema,
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

        // Create dynamic schema with UI-based required fields and clear hidden fields
        const { schema: dynamicSchema, updatedData } = createDynamicSchema(
          state.schema,
          state.uischema,
          newState,
          state.ajv
        );

        const errors = validate(state.validator, updatedData);

        return {
          ...state,
          data: updatedData,
          schema: dynamicSchema,
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
