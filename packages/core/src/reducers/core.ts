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
import isArray from 'lodash/isArray';
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
  hasValueRule,
  evalValue,
  hasShowRule,
  isVisible,
  evaluateCondition,
  isControlElement,
  isLayout,
  composePaths,
  toDataPath,
} from '../util';
import { JsonSchema } from '../models/jsonSchema';
import {
  UISchemaElement,
  SchemaBasedCondition,
  Rule,
  RuleEffect,
  PopulateOptions,
} from '../models';

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

  let dataChanged = false;
  let schemaChanged = false;

  // Start with references to original objects
  let updatedData = data;
  let updatedSchema = schema;

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

  const hasPreserveValueOnHide = (control: any): boolean => {
    const rules = Array.isArray(control.rule)
      ? control.rule
      : [control.rule].filter(Boolean);
    return rules.some((r: Rule) => r.options?.preserveValueOnHide === true);
  };

  Object.keys(schema.properties).forEach((key) => {
    const control = findControlForProperty(uischema, key);
    if (control) {
      const { path } = getConditionPath(control, key);
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

      // Visibility rule: if field is hidden and preserveValueOnHide is not true, clear it
      if (hasShowRule(control) && data !== undefined) {
        // Check if the field is hidden
        const isFieldVisible = isVisible(control, data, path, ajv);
        const shouldClearHiddenValue =
          !isFieldVisible &&
          data[key] !== undefined &&
          !hasPreserveValueOnHide(control);
        // Only create a copy if we haven't already
        if (shouldClearHiddenValue) {
          if (!dataChanged) {
            updatedData = { ...data };
            dataChanged = true;
          }
          // Clear the value (set to undefined)
          updatedData = setFp(key, undefined, updatedData);
        }

        if (
          !isFieldVisible &&
          schema.properties[key]?.default !== undefined &&
          !hasPreserveValueOnHide(control)
        ) {
          if (!schemaChanged) {
            updatedSchema = {
              ...schema,
              properties: { ...schema.properties },
            } as JsonSchema;
            schemaChanged = true;
          }
          const propertySchema = { ...updatedSchema.properties[key] };
          delete propertySchema.default;
          updatedSchema.properties[key] = propertySchema;
        }
      }
    }
  });

  return {
    schema: updatedSchema,
    updatedData,
  };
};

const isEmptySourceValue = (value: any): boolean =>
  value === undefined || value === null || value === '';

const pathAffects = (changedPath: string, targetPath: string): boolean => {
  if (changedPath === '' || targetPath === '') {
    return true;
  }
  if (!changedPath || !targetPath) {
    return false;
  }
  const boundaryOk = (full: string, prefix: string) => {
    if (full.length === prefix.length) return true;
    const next = full.charAt(prefix.length);
    return next === '.' || next === '[';
  };
  return (
    (changedPath.startsWith(targetPath) &&
      boundaryOk(changedPath, targetPath)) ||
    (targetPath.startsWith(changedPath) && boundaryOk(targetPath, changedPath))
  );
};

const computePopulateValue = (
  sourceValue: any,
  options: PopulateOptions,
  ajv: Ajv
): { shouldSet: boolean; newValue: any } => {
  if (isEmptySourceValue(sourceValue)) {
    return { shouldSet: false, newValue: undefined };
  }

  let base: any = sourceValue;

  if (options.select) {
    if (!isArray(base)) {
      return { shouldSet: false, newValue: undefined };
    }
    const where = options.select.where;
    if (!where) {
      return { shouldSet: false, newValue: undefined };
    }

    const match = (base as any[]).find((el) => {
      try {
        return ajv.validate(where.schema, el) as boolean;
      } catch (e) {
        // Invalid schema or validation error -> no match
        return false;
      }
    });
    if (match === undefined) {
      return { shouldSet: false, newValue: undefined };
    }
    base = match;
  }

  if (options.valuePath && options.valuePath.length > 0) {
    const extracted = get(base, options.valuePath);
    if (extracted === undefined) {
      return { shouldSet: false, newValue: undefined };
    }
    return { shouldSet: true, newValue: extracted };
  }

  return { shouldSet: true, newValue: base };
};

const getParentPath = (path: string): string => {
  if (!path) {
    return '';
  }
  const lastDot = path.lastIndexOf('.');
  return lastDot === -1 ? '' : path.slice(0, lastDot);
};

const normalizePathForCompare = (path: string): string =>
  path ? path.replace(/\[(\d+)\]/g, '.$1') : path;

const extractIndexFromPath = (
  changedPath: string,
  arrayPath: string
): number | null => {
  if (!changedPath || !arrayPath) {
    return null;
  }
  const normalizedChanged = normalizePathForCompare(changedPath);
  const normalizedArray = normalizePathForCompare(arrayPath);
  if (!normalizedChanged.startsWith(`${normalizedArray}.`)) {
    return null;
  }
  const rest = normalizedChanged.slice(normalizedArray.length + 1);
  const idxStr = rest.split('.')[0];
  const idx = Number(idxStr);
  return Number.isInteger(idx) ? idx : null;
};

const getDetailBasePaths = (
  arrayPath: string,
  changedPath: string,
  data: any
): string[] => {
  const normalizedArrayPath = normalizePathForCompare(arrayPath);
  const normalizedChanged = normalizePathForCompare(changedPath);
  const value = get(data, normalizedArrayPath);
  if (!isArray(value)) {
    return [];
  }

  if (normalizedChanged === normalizedArrayPath) {
    return value.map((_: any, idx: number) => `${normalizedArrayPath}.${idx}`);
  }

  const idx = extractIndexFromPath(normalizedChanged, normalizedArrayPath);
  if (idx !== null) {
    return [`${normalizedArrayPath}.${idx}`];
  }

  if (
    normalizedChanged === '' ||
    normalizedChanged === undefined ||
    normalizedChanged === null
  ) {
    return value.map((_: any, idx: number) => `${normalizedArrayPath}.${idx}`);
  }

  if (
    pathAffects(
      normalizePathForCompare(changedPath),
      normalizePathForCompare(arrayPath)
    )
  ) {
    return value.map((_: any, idx: number) => `${normalizedArrayPath}.${idx}`);
  }

  return [];
};

const applyPopulateRules = (
  prevData: any,
  nextData: any,
  uischema: UISchemaElement,
  changedPath: string,
  ajv: Ajv
): any => {
  if (!uischema || changedPath === undefined || changedPath === null) {
    return nextData;
  }

  let updatedData = nextData;
  let dataChanged = false;

  const applyToControl = (control: any, basePath: string) => {
    const rules: Rule[] = Array.isArray(control.rule)
      ? control.rule
      : control.rule
      ? [control.rule]
      : [];

    if (rules.length === 0) {
      return;
    }

    const localDestPath = control.scope ? toDataPath(control.scope) : '';
    const destPath =
      localDestPath && basePath
        ? composePaths(basePath, localDestPath)
        : basePath || localDestPath;
    if (!destPath) {
      return;
    }
    const conditionBasePath = (() => {
      const parentPath = getParentPath(localDestPath);
      if (!parentPath) {
        return basePath;
      }
      return basePath ? composePaths(basePath, parentPath) : parentPath;
    })();

    for (const rule of rules) {
      const effects = Array.isArray(rule.effect) ? rule.effect : [rule.effect];
      if (!effects.includes(RuleEffect.POPULATE)) {
        continue;
      }
      const pop: PopulateOptions | undefined = rule.options?.populate;
      if (!pop?.from) {
        continue;
      }

      const localFromPath = toDataPath(pop.from);
      const fromPath =
        localFromPath && basePath
          ? composePaths(basePath, localFromPath)
          : basePath || localFromPath;
      if (!fromPath) {
        continue;
      }

      const prevSource = get(prevData, fromPath);
      const nextSource = get(updatedData, fromPath);
      const sourceChanged = !isEqual(prevSource, nextSource);

      const conditionNow = evaluateCondition(
        updatedData,
        rule.condition,
        conditionBasePath,
        ajv
      );
      const conditionPrev = prevData
        ? evaluateCondition(prevData, rule.condition, conditionBasePath, ajv)
        : false;
      const conditionBecameTrue = !conditionPrev && conditionNow;

      if (
        !pathAffects(
          normalizePathForCompare(changedPath),
          normalizePathForCompare(fromPath)
        ) &&
        !conditionBecameTrue
      ) {
        continue;
      }

      if (!sourceChanged && !conditionBecameTrue) {
        continue;
      }

      const currentDest = get(updatedData, destPath);

      const overwrite = pop.overwrite !== undefined ? pop.overwrite : true;

      // If source becomes empty and overwrite is enabled, clear destination
      if (isEmptySourceValue(nextSource)) {
        if (!overwrite) {
          continue;
        }
        if (!sourceChanged) {
          continue;
        }
        if (currentDest === undefined) {
          continue;
        }
        if (!dataChanged) {
          updatedData = cloneDeep(updatedData);
          dataChanged = true;
        }
        updatedData = unsetFp(destPath, updatedData);
        continue;
      }

      if (!conditionNow) {
        continue;
      }

      const { shouldSet, newValue } = computePopulateValue(
        nextSource,
        {
          overwrite: true,
          ...pop,
        },
        ajv
      );
      if (!shouldSet) {
        continue;
      }

      const destIsEmpty = isEmptySourceValue(currentDest);
      if (!overwrite && !destIsEmpty) {
        continue;
      }

      if (isEqual(currentDest, newValue)) {
        continue;
      }

      if (!dataChanged) {
        updatedData = cloneDeep(updatedData);
        dataChanged = true;
      }

      if (newValue === undefined) {
        updatedData = unsetFp(destPath, updatedData);
      } else {
        updatedData = setFp(destPath, newValue, updatedData);
      }
    }
  };

  const traverse = (element: UISchemaElement, basePath: string) => {
    if (isLayout(element)) {
      if (Array.isArray(element.elements)) {
        element.elements.forEach((child) => traverse(child, basePath));
      }
      return;
    }
    if (!isControlElement(element)) {
      return;
    }

    const control: any = element;
    applyToControl(control, basePath);

    const detail = control.options?.detail;
    if (detail) {
      const controlPath = control.scope ? toDataPath(control.scope) : '';
      const arrayPath =
        controlPath && basePath
          ? composePaths(basePath, controlPath)
          : basePath || controlPath;

      if (!arrayPath) {
        return;
      }

      const detailPaths = getDetailBasePaths(
        arrayPath,
        changedPath,
        updatedData
      );
      detailPaths.forEach((detailPath) => traverse(detail, detailPath));
    }
  };

  traverse(uischema, '');

  return updatedData;
};

export const coreReducer: Reducer<JsonFormsCore, CoreActions> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case INIT: {
      const thisAjv = getOrCreateAjv(state, action);
      const validationMode = getValidationMode(state, action);

      const populatedData = applyPopulateRules(
        undefined,
        action.data,
        action.uischema,
        '',
        thisAjv
      );

      // Create dynamic schema with UI-based required fields
      const { schema: dynamicSchema, updatedData } = createDynamicSchema(
        action.schema,
        action.uischema,
        populatedData,
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

      const populatedData = applyPopulateRules(
        state.data,
        action.data,
        action.uischema,
        '',
        thisAjv
      );

      // Create dynamic schema with UI-based required fields
      const { schema: dynamicSchema, updatedData } = createDynamicSchema(
        action.schema,
        action.uischema,
        populatedData,
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
        const populated = applyPopulateRules(
          state.data,
          result,
          state.uischema,
          '',
          state.ajv
        );

        // Create dynamic schema with UI-based required fields and clear hidden fields
        const { schema: dynamicSchema, updatedData } = createDynamicSchema(
          state.schema,
          state.uischema,
          populated,
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
        const populated = applyPopulateRules(
          state.data,
          newState,
          state.uischema,
          action.path,
          state.ajv
        );

        // Create dynamic schema with UI-based required fields and clear hidden fields
        const { schema: dynamicSchema, updatedData } = createDynamicSchema(
          state.schema,
          state.uischema,
          populated,
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
