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
  ControlElement,
  Layout,
  Rule,
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

const getConditionScope = (condition: Scopable, path: string): string => {
  // If scope is "#", we want the entire data object
  if (condition.scope === '#') {
    return '';
  }
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
    const scope = getConditionScope(condition, path);
    const value = scope ? resolveData(data, scope) : data;
    if (condition.failWhenUndefined && value === undefined) {
      return false;
    }
    const result = ajv.validate(condition.schema, value) as boolean;
    return result;
  } else {
    // unknown condition
    return true;
  }
};

// Effect compatibility groups - effects in the same group are mutually exclusive
const EFFECT_GROUPS = {
  VISIBILITY: [RuleEffect.SHOW, RuleEffect.HIDE],
  ENABLEMENT: [RuleEffect.ENABLE, RuleEffect.DISABLE],
  REQUIREMENT: [RuleEffect.REQUIRED],
  VALUE: [RuleEffect.FILL_VALUE, RuleEffect.CLEAR_VALUE],
};

// Check if two effects are compatible (not in the same group)
const areEffectsCompatible = (
  effect1: RuleEffect,
  effect2: RuleEffect
): boolean => {
  return !Object.values(EFFECT_GROUPS).some(
    (group) => group.includes(effect1) && group.includes(effect2)
  );
};

// Validate that all effects in a rule set are compatible
export const validateEffects = (effects: RuleEffect[]): boolean => {
  for (let i = 0; i < effects.length; i++) {
    for (let j = i + 1; j < effects.length; j++) {
      if (!areEffectsCompatible(effects[i], effects[j])) {
        console.warn(
          `Incompatible effects found: ${effects[i]} and ${effects[j]}`
        );
        return false;
      }
    }
  }
  return true;
};

const normalizeRules = (rule: Rule | Rule[] | undefined): Rule[] => {
  if (!rule) return [];
  return Array.isArray(rule) ? rule : [rule];
};

// Helper to get array of effects
const getEffects = (rule: Rule): RuleEffect[] => {
  return Array.isArray(rule.effect) ? rule.effect : [rule.effect];
};

// Helper to find specific effect type
const findEffect = (
  effects: RuleEffect[],
  targetEffects: RuleEffect[]
): RuleEffect | undefined => {
  return effects.find((effect) => targetEffects.includes(effect));
};

export const evalVisibility = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv
): boolean => {
  const rules = normalizeRules(uischema.rule);
  let visibility = true;

  for (const rule of rules) {
    const effects = getEffects(rule);
    const visibilityEffect = findEffect(effects, [
      RuleEffect.SHOW,
      RuleEffect.HIDE,
    ]);
    if (!visibilityEffect) continue;

    const fulfilled = evaluateCondition(data, rule.condition, path, ajv);
    if (visibilityEffect === RuleEffect.SHOW) {
      visibility = fulfilled;
    } else if (visibilityEffect === RuleEffect.HIDE) {
      visibility = !fulfilled;
    }
  }

  return visibility;
};

export const evalEnablement = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv
): boolean => {
  const rules = normalizeRules(uischema.rule);
  let enabled = true;

  for (const rule of rules) {
    const effects = getEffects(rule);
    const enableEffect = findEffect(effects, [
      RuleEffect.ENABLE,
      RuleEffect.DISABLE,
    ]);
    if (!enableEffect) continue;

    const fulfilled = evaluateCondition(data, rule.condition, path, ajv);
    if (enableEffect === RuleEffect.ENABLE) {
      enabled = fulfilled;
    } else if (enableEffect === RuleEffect.DISABLE) {
      enabled = !fulfilled;
    }
  }

  return enabled;
};

export const evalValue = (
  uischema: UISchemaElement,
  data: any,
  path: string = undefined,
  ajv: Ajv
): { shouldUpdate: boolean; newValue: any } => {
  const rules = normalizeRules(uischema.rule);

  for (const rule of rules) {
    const effects = getEffects(rule);
    const valueEffect = findEffect(effects, [
      RuleEffect.FILL_VALUE,
      RuleEffect.CLEAR_VALUE,
    ]);
    if (!valueEffect) {
      continue;
    }

    const fulfilled = evaluateCondition(data, rule.condition, path, ajv);

    if (!fulfilled) {
      continue;
    }

    if (valueEffect === RuleEffect.FILL_VALUE) {
      // If FILL_VALUE is matched, we must have a value
      const newValue = rule.options?.value;
      return {
        shouldUpdate: newValue !== undefined,
        newValue: newValue,
      };
    }

    if (valueEffect === RuleEffect.CLEAR_VALUE) {
      return {
        shouldUpdate: true,
        newValue: undefined,
      };
    }
  }

  return { shouldUpdate: false, newValue: undefined };
};

// Update the has*Rule functions to work with arrays of effects
export const hasShowRule = (uischema: UISchemaElement): boolean => {
  return normalizeRules(uischema.rule).some((rule) =>
    getEffects(rule).some((effect) =>
      [RuleEffect.SHOW, RuleEffect.HIDE].includes(effect)
    )
  );
};

export const hasEnableRule = (uischema: UISchemaElement): boolean => {
  return normalizeRules(uischema.rule).some((rule) =>
    getEffects(rule).some((effect) =>
      [RuleEffect.ENABLE, RuleEffect.DISABLE].includes(effect)
    )
  );
};

export const hasValueRule = (uischema: UISchemaElement): boolean => {
  return normalizeRules(uischema.rule).some((rule) =>
    getEffects(rule).some((effect) =>
      [RuleEffect.FILL_VALUE, RuleEffect.CLEAR_VALUE].includes(effect)
    )
  );
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

export const findControlForProperty = (
  uischema: UISchemaElement,
  propertyPath: string
): ControlElement | undefined => {
  if (!uischema) {
    return undefined;
  }

  if (uischema.type === 'Control') {
    const control = uischema as ControlElement;
    if (control.scope?.endsWith(propertyPath)) {
      return control;
    }
  }

  // Check if 'elements' exists in uischema first
  if ('elements' in uischema) {
    const layout = uischema as Layout;
    // Now safely check the elements array
    if (Array.isArray(layout.elements) && layout.elements.length > 0) {
      for (const element of layout.elements) {
        const found = findControlForProperty(element, propertyPath);
        if (found) {
          return found;
        }
      }
    }
  }

  return undefined;
};
