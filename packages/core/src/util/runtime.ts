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
  JsonSchema,
  LeafCondition,
  OrCondition,
  RuleEffect,
  SchemaBasedCondition,
  Scopable,
  UISchemaElement
} from '../models';
import { resolveData } from './resolvers';
import { composeWithUi } from './path';
import Ajv from 'ajv';
import { getAjv } from '../reducers';
import { JsonFormsState } from '../store';

const isOrCondition = (condition: Condition): condition is OrCondition =>
  condition.type === 'OR';

const isAndCondition = (condition: Condition): condition is AndCondition =>
  condition.type === 'AND';

const isLeafCondition = (condition: Condition): condition is LeafCondition =>
  condition.type === 'LEAF';

const isSchemaCondition = (
  condition: Condition
): condition is SchemaBasedCondition => has(condition, 'schema');

const getConditionScope = (condition: Scopable, path: string): string => {
  return composeWithUi(condition, path);
};

const evaluateCondition = (
  data: any,
  condition: Condition,
  path: string,
  ajv: Ajv
): boolean => {
  if (isAndCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) => acc && evaluateCondition(data, cur, path, ajv),
      true
    );
  } else if (isOrCondition(condition)) {
    return condition.conditions.reduce(
      (acc, cur) => acc || evaluateCondition(data, cur, path, ajv),
      false
    );
  } else if (isLeafCondition(condition)) {
    const value = resolveData(data, getConditionScope(condition, path));
    return value === condition.expectedValue;
  } else if (isSchemaCondition(condition)) {
    const value = resolveData(data, getConditionScope(condition, path));
    return ajv.validate(condition.schema, value) as boolean;
  } else {
    // unknown condition
    return true;
  }
};

const isRuleFulfilled = (
  uischema: UISchemaElement,
  data: any,
  path: string,
  ajv: Ajv
): boolean => {
  const condition = uischema.rule.condition;
  return evaluateCondition(data, condition, path, ajv);
};

export const evalVisibility = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, ajv);

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
  ajv: Ajv
): boolean => {
  const fulfilled = isRuleFulfilled(uischema, data, path, ajv);

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
  ajv: Ajv
): boolean => {
  if (uischema.rule) {
    return evalVisibility(uischema, data, path, ajv);
  }

  return true;
};

export const isEnabled = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv
): boolean => {
  if (uischema.rule) {
    return evalEnablement(uischema, data, path, ajv);
  }

  return true;
};

/**
 * Indicates whether the given `uischema` element shall be enabled or disabled.
 * Checks the global readonly flag, uischema rule, uischema options (including the config),
 * the schema and the enablement indicator of the parent.
 */
export const isInherentlyEnabled = (
  state: JsonFormsState,
  ownProps: any,
  uischema: UISchemaElement,
  schema: JsonSchema & { readOnly?: boolean } | undefined,
  rootData: any,
  config: any
) => {
  if (state?.jsonforms?.readonly) {
    return false;
  }
  if (uischema && hasEnableRule(uischema)) {
    return isEnabled(uischema, rootData, ownProps?.path, getAjv(state));
  }
  if (typeof uischema?.options?.readonly === 'boolean') {
    return !uischema.options.readonly;
  }
  if (typeof uischema?.options?.readOnly === 'boolean') {
    return !uischema.options.readOnly;
  }
  if (typeof config?.readonly === 'boolean') {
    return !config.readonly;
  }
  if (typeof config?.readOnly === 'boolean') {
    return !config.readOnly;
  }
  if (schema?.readOnly === true) {
    return false;
  }
  if (typeof ownProps?.enabled === 'boolean') {
    return ownProps.enabled;
  }
  return true;
};
