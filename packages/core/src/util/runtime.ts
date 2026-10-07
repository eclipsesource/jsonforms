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

import has from 'lodash/has';
import {
  AndCondition,
  Condition,
  LeafCondition,
  OrCondition,
  RuleEffect,
  SchemaBasedCondition,
  Scopable,
  UISchemaElement,
  ValidateFunctionCondition,
} from '../models';
import { resolveData } from './resolvers';
import type Ajv from 'ajv';
import { composeWithUi } from './uischema';
import isFunction from 'lodash/isFunction';
import type { JsonSchema } from '../models';
import {
  FormValidator,
  FormValidatorFactory,
  isFormValidator,
  isFormValidatorFactory,
} from './formValidator';
import { isSchemaMatch } from './structural';

/**
 * What rule conditions are evaluated with:
 * - an AJV instance (the historical argument): `ajv.validate(schema, data)`;
 * - a Form Validator: its `matches`, or core's own schema matcher
 *   ({@link isSchemaMatch}) when it has none;
 * - a Form Validator Factory: one Form Validator per condition schema, cached;
 * - `undefined`: core's own schema matcher alone.
 */
export type RuleValidator =
  | Ajv
  | FormValidator
  | FormValidatorFactory
  | undefined;

const isAjvInstance = (candidate: unknown): candidate is Ajv =>
  typeof candidate === 'object' &&
  candidate !== null &&
  isFunction((candidate as Ajv).compile) &&
  isFunction((candidate as Ajv).validate);

const conditionValidators = new WeakMap<
  FormValidatorFactory,
  WeakMap<object, FormValidator>
>();

const conditionValidatorFor = (
  factory: FormValidatorFactory,
  schema: JsonSchema
): FormValidator => {
  if (typeof schema !== 'object' || schema === null) {
    return factory(schema);
  }
  let perSchema = conditionValidators.get(factory);
  if (perSchema === undefined) {
    perSchema = new WeakMap();
    conditionValidators.set(factory, perSchema);
  }
  let validator = perSchema.get(schema);
  if (validator === undefined) {
    validator = factory(schema);
    perSchema.set(schema, validator);
  }
  return validator;
};

/**
 * Whether `data` satisfies the rule condition `schema`, evaluated with the
 * given {@link RuleValidator}.
 */
export const matchesConditionSchema = (
  schema: JsonSchema,
  data: unknown,
  validator: RuleValidator
): boolean => {
  if (isAjvInstance(validator)) {
    return validator.validate(schema, data) as boolean;
  }
  if (isFormValidatorFactory(validator)) {
    return conditionValidatorFor(validator, schema).validate(data).length === 0;
  }
  if (isFormValidator(validator)) {
    return validator.matches
      ? validator.matches(schema, data)
      : isSchemaMatch(schema, data);
  }
  return isSchemaMatch(schema, data);
};

const isOrCondition = (condition: Condition): condition is OrCondition =>
  condition.type === 'OR';

const isAndCondition = (condition: Condition): condition is AndCondition =>
  condition.type === 'AND';

const isLeafCondition = (condition: Condition): condition is LeafCondition =>
  condition.type === 'LEAF';

const isSchemaCondition = (
  condition: Condition
): condition is SchemaBasedCondition => has(condition, 'schema');

const isValidateFunctionCondition = (
  condition: Condition
): condition is ValidateFunctionCondition =>
  has(condition, 'validate') &&
  typeof (condition as ValidateFunctionCondition).validate === 'function';

const getConditionScope = (condition: Scopable, path: string): string => {
  return composeWithUi(condition, path);
};

const evaluateCondition = (
  data: any,
  uischema: UISchemaElement,
  condition: Condition,
  path: string,
  validator: RuleValidator,
  config: unknown
): boolean => {
  if (isAndCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) =>
        acc && evaluateCondition(data, uischema, cur, path, validator, config),
      true
    );
  } else if (isOrCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) =>
        acc || evaluateCondition(data, uischema, cur, path, validator, config),
      false
    );
  } else if (isLeafCondition(condition)) {
    const value = resolveData(data, getConditionScope(condition, path));
    return value === condition.expectedValue;
  } else if (isSchemaCondition(condition)) {
    const value = resolveData(data, getConditionScope(condition, path));
    if (condition.failWhenUndefined && value === undefined) {
      return false;
    }
    return matchesConditionSchema(condition.schema, value, validator);
  } else if (isValidateFunctionCondition(condition)) {
    const value = resolveData(data, getConditionScope(condition, path));
    const context = {
      data: value,
      fullData: data,
      path,
      uischemaElement: uischema,
      config,
    };
    return condition.validate(context);
  } else {
    // unknown condition
    return true;
  }
};

const isRuleFulfilled = (
  uischema: UISchemaElement,
  data: any,
  path: string,
  validator: RuleValidator,
  config: unknown
): boolean => {
  const condition = uischema.rule.condition;
  return evaluateCondition(data, uischema, condition, path, validator, config);
};

export const evalVisibility = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, validator, config);

  switch (uischema.rule.effect) {
    case RuleEffect.HIDE:
      return !fulfilled;
    case RuleEffect.SHOW:
      return fulfilled;
    // visible by default
    default:
      return true;
  }
};

export const evalEnablement = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, validator, config);

  switch (uischema.rule.effect) {
    case RuleEffect.DISABLE:
      return !fulfilled;
    case RuleEffect.ENABLE:
      return fulfilled;
    // enabled by default
    default:
      return true;
  }
};

export const evalReadonly = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, validator, config);

  switch (uischema.rule.effect) {
    case RuleEffect.WRITABLE:
      return !fulfilled;
    case RuleEffect.READONLY:
      return fulfilled;
    // writable by default
    default:
      return false;
  }
};

export const hasShowRule = (uischema: UISchemaElement): boolean => {
  if (
    uischema.rule &&
    (uischema.rule.effect === RuleEffect.SHOW ||
      uischema.rule.effect === RuleEffect.HIDE)
  ) {
    return true;
  }
  return false;
};

export const hasEnableRule = (uischema: UISchemaElement): boolean => {
  if (
    uischema.rule &&
    (uischema.rule.effect === RuleEffect.ENABLE ||
      uischema.rule.effect === RuleEffect.DISABLE)
  ) {
    return true;
  }
  return false;
};

export const hasReadonlyRule = (uischema: UISchemaElement): boolean => {
  if (
    uischema.rule &&
    (uischema.rule.effect === RuleEffect.READONLY ||
      uischema.rule.effect === RuleEffect.WRITABLE)
  ) {
    return true;
  }
  return false;
};

export const isVisible = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  if (uischema.rule) {
    return evalVisibility(uischema, data, path, validator, config);
  }

  return true;
};

export const isEnabled = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  if (uischema.rule) {
    return evalEnablement(uischema, data, path, validator, config);
  }

  return true;
};

export const isReadonly = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  validator: RuleValidator,
  config: unknown
): boolean => {
  if (uischema.rule) {
    return evalReadonly(uischema, data, path, validator, config);
  }

  return false;
};
