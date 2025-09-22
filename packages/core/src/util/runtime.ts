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
  ajv: Ajv,
  config: unknown
): boolean => {
  if (isAndCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) =>
        acc && evaluateCondition(data, uischema, cur, path, ajv, config),
      true
    );
  } else if (isOrCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) =>
        acc || evaluateCondition(data, uischema, cur, path, ajv, config),
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
    return ajv.validate(condition.schema, value) as boolean;
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
  ajv: Ajv,
  config: unknown
): boolean => {
  const condition = uischema.rule.condition;
  return evaluateCondition(data, uischema, condition, path, ajv, config);
};

export const evalVisibility = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv,
  config: unknown
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, ajv, config);

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
  ajv: Ajv,
  config: unknown
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, ajv, config);

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

export const isVisible = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv,
  config: unknown
): boolean => {
  if (uischema.rule) {
    return evalVisibility(uischema, data, path, ajv, config);
  }

  return true;
};

export const isEnabled = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv,
  config: unknown
): boolean => {
  if (uischema.rule) {
    return evalEnablement(uischema, data, path, ajv, config);
  }

  return true;
};
