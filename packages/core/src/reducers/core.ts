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
import isEqual from 'lodash/isEqual';
import { resolveData } from '../util/resolvers';
import { setDataAt, unsetDataAt } from '../util/setData';
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
import type { JsonSchema } from '../models';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import isFunction from 'lodash/isFunction';
import { createAjv, validate } from '../util/validator';
import {
  compiledAjvValidator,
  createAjvValidator,
  FormValidator,
  isAjvFormValidator,
  issuesToErrors,
  toFormValidatorFactory,
  ValidatorOption,
} from '../util/formValidator';

export const initState: JsonFormsCore = {
  data: {},
  schema: {},
  uischema: undefined,
  errors: [],
  validator: undefined,
  ajv: undefined,
  validationMode: 'ValidateAndShow',
  additionalErrors: [],
  formValidator: undefined,
  validatorOption: undefined,
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

const hasValidatorOption = (option: any): option is InitActionOptions =>
  !!option && !isFunction(option.compile) && 'validator' in option;

/**
 * The custom `validator` option in effect for an action: the one given in the
 * action's options (an explicit `validator: undefined` switches back to AJV),
 * or the one already stored in state when the options do not mention a
 * validator at all. Returns `undefined` when AJV performs the validation.
 */
export const getValidatorOption = (
  state: JsonFormsCore,
  action?: InitAction | UpdateCoreAction
): ValidatorOption | undefined => {
  if (action && hasValidatorOption(action.options)) {
    return action.options.validator;
  }
  return state.validatorOption;
};

/**
 * Creates the Form Validator for `schema`: through the custom option when one
 * is configured, otherwise through the built-in AJV adapter.
 */
const createFormValidator = (
  option: ValidatorOption | undefined,
  ajv: Ajv | undefined,
  schema: JsonSchema,
  validationMode: ValidationMode
): FormValidator | undefined => {
  if (validationMode === 'NoValidation') {
    return undefined;
  }
  const factory =
    option === undefined
      ? createAjvValidator(ajv)
      : toFormValidatorFactory(option);
  return factory(schema);
};

/**
 * The Form Validator to validate with: the cached one, or, for states that
 * only carry a compiled AJV function (e.g. constructed by hand), that
 * function wrapped as a Form Validator.
 */
const currentFormValidator = (
  state: JsonFormsCore
): FormValidator | undefined =>
  state.formValidator ??
  (state.validator ? compiledAjvValidator(state.validator) : undefined);

const runValidation = (
  formValidator: FormValidator | undefined,
  data: any,
  schema: JsonSchema
): ErrorObject[] => {
  if (formValidator === undefined) {
    return [];
  }
  if (isAjvFormValidator(formValidator)) {
    // AJV errors already have the stored shape; hand them over untouched.
    return validate(formValidator.validateFn, data);
  }
  return issuesToErrors(formValidator.validate(data), schema);
};

/** The compiled AJV function behind a Form Validator, for `state.validator`. */
const legacyValidateFn = (formValidator: FormValidator | undefined) =>
  isAjvFormValidator(formValidator) ? formValidator.validateFn : undefined;

export const coreReducer: Reducer<JsonFormsCore, CoreActions> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);
      const validatorOption = getValidatorOption(state, action);
      const validationMode = getValidationMode(state, action);
      const formValidator = createFormValidator(
        validatorOption,
        thisAjv,
        action.schema,
        validationMode
      );
      const e = runValidation(formValidator, action.data, action.schema);
      const additionalErrors = getAdditionalErrors(state, action);

      return {
        ...state,
        data: action.data,
        schema: action.schema,
        uischema: action.uischema,
        additionalErrors,
        errors: e,
        validator: legacyValidateFn(formValidator),
        formValidator,
        validatorOption,
        ajv: thisAjv,
        validationMode,
      };
    }
    case UPDATE_CORE: {
      const thisAjv = getOrCreateAjv(state, action);
      const validatorOption = getValidatorOption(state, action);
      const validationMode = getValidationMode(state, action);
      let formValidator = currentFormValidator(state);
      let errors = state.errors;
      if (
        state.schema !== action.schema ||
        state.validationMode !== validationMode ||
        state.ajv !== thisAjv ||
        state.validatorOption !== validatorOption
      ) {
        // revalidate only if necessary
        formValidator = createFormValidator(
          validatorOption,
          thisAjv,
          action.schema,
          validationMode
        );
        errors = runValidation(formValidator, action.data, action.schema);
      } else if (state.data !== action.data) {
        errors = runValidation(formValidator, action.data, action.schema);
      }
      const validator = legacyValidateFn(formValidator);
      const additionalErrors = getAdditionalErrors(state, action);

      const stateChanged =
        state.data !== action.data ||
        state.schema !== action.schema ||
        state.uischema !== action.uischema ||
        state.ajv !== thisAjv ||
        state.errors !== errors ||
        state.validator !== validator ||
        state.formValidator !== formValidator ||
        state.validatorOption !== validatorOption ||
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
            validator,
            formValidator,
            validatorOption,
            validationMode: validationMode,
            additionalErrors,
          }
        : state;
    }
    case SET_AJV: {
      const currentAjv = action.ajv;
      const formValidator = createFormValidator(
        state.validatorOption,
        currentAjv,
        state.schema,
        state.validationMode
      );
      const errors = runValidation(formValidator, state.data, state.schema);
      return {
        ...state,
        ajv: currentAjv,
        validator: legacyValidateFn(formValidator),
        formValidator,
        errors,
      };
    }
    case SET_SCHEMA: {
      const needsNewValidator =
        action.schema &&
        (state.ajv || state.validatorOption) &&
        state.validationMode !== 'NoValidation';
      const formValidator = needsNewValidator
        ? createFormValidator(
            state.validatorOption,
            state.ajv,
            action.schema,
            state.validationMode
          )
        : currentFormValidator(state);
      const errors = runValidation(formValidator, state.data, action.schema);
      return {
        ...state,
        validator: legacyValidateFn(formValidator),
        formValidator,
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
        const errors = runValidation(
          currentFormValidator(state),
          result,
          state.schema
        );
        return {
          ...state,
          data: result,
          errors,
        };
      } else {
        const oldData: any = resolveData(state.data, action.path);
        const newData = action.updater(cloneDeep(oldData));
        let newState: any;
        if (newData !== undefined) {
          newState = setDataAt(
            state.data === undefined ? {} : state.data,
            action.path,
            newData,
            state.schema
          );
        } else {
          newState = unsetDataAt(
            state.data === undefined ? {} : state.data,
            action.path
          );
        }
        const errors = runValidation(
          currentFormValidator(state),
          newState,
          state.schema
        );
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
        return {
          ...state,
          errors: [],
          validator: undefined,
          formValidator: undefined,
          validationMode: action.validationMode,
        };
      }
      if (state.validationMode === 'NoValidation') {
        const formValidator = createFormValidator(
          state.validatorOption,
          state.ajv,
          state.schema,
          action.validationMode
        );
        const errors = runValidation(formValidator, state.data, state.schema);
        return {
          ...state,
          validator: legacyValidateFn(formValidator),
          formValidator,
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
