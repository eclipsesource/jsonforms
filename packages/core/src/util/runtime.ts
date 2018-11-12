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
// TODO: pass in uischema and data instead of props and state
import { getData } from '../reducers';
import {
    Condition,
    LeafCondition,
    RuleEffect,
    SchemaBasedCondition,
    UISchemaElement
} from '../models/uischema';
import { resolveData } from './resolvers';
import { toDataPath } from './path';
import { createAjv } from './validator';
import { StatePropsOfRenderer } from './renderer';
import { JsonFormsState } from '../store';

const ajv = createAjv();

const ruleIsMissingProperties = (uischema: UISchemaElement): boolean =>
    !_.has(uischema, 'rule.condition') ||
    !_.has(uischema, 'rule.condition.scope') ||
    (!_.has(uischema, 'rule.condition.expectedValue') && !_.has(uischema, 'rule.condition.schema'));

const isLeafCondition = (condition: Condition): condition is LeafCondition =>
    condition.type === 'LEAF';

const isSchemaCondition = (condition: Condition): condition is SchemaBasedCondition =>
    _.has(condition, 'schema');

const getConditionScope = (uischema: UISchemaElement): string => {
    if (ruleIsMissingProperties(uischema)) {
        return undefined;
    }
    return toDataPath(uischema.rule.condition.scope);
};

const isConditionFulfilled =
    (uischema: UISchemaElement, data: any, conditionScope: string): boolean => {
        if (ruleIsMissingProperties(uischema)) {
            return true;
        }

        const condition = uischema.rule.condition;

        if (isLeafCondition(condition)) {
            const value = resolveData(data, conditionScope);
            return value === condition.expectedValue;
        } else if (isSchemaCondition(condition)) {
            const value = resolveData(data, conditionScope);
            return ajv.validate(condition.schema, value) as boolean;
        } else {
            // unknown condition
            return true;
        }
    };

export const evalVisibility =
    (uischema: UISchemaElement, data: any, rulePath: string = getConditionScope(uischema)): boolean => {
        const fulfilled = isConditionFulfilled(uischema, data, rulePath);

        switch (uischema.rule.effect) {
            case RuleEffect.HIDE: return !fulfilled;
            case RuleEffect.SHOW: return fulfilled;
            // visible by default
            default: return true;
        }
    };

export const evalEnablement = (uischema: UISchemaElement, data: any, rulePath: string = getConditionScope(uischema)) => {
    const fulfilled = isConditionFulfilled(uischema, data, rulePath);

    switch (uischema.rule.effect) {
        case RuleEffect.DISABLE: return !fulfilled;
        case RuleEffect.ENABLE: return fulfilled;
        // enabled by default
        default: return true;
    }
};

export const isVisible =
    (props: StatePropsOfRenderer, state: JsonFormsState, path: string = undefined): boolean => {

        if (props.uischema.rule) {
            return evalVisibility(props.uischema, getData(state), path);
        }

        return true;
    };

export const isEnabled =
    (props: StatePropsOfRenderer, state: JsonFormsState, path: string = undefined): boolean => {

        if (props.uischema.rule) {
            return evalEnablement(props.uischema, getData(state), path);
        }

        return true;
    };
