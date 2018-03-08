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
import { LeafCondition, RuleEffect, UISchemaElement } from '../models/uischema';
import { resolveData } from './resolvers';
import { toDataPath } from './path';

export const evalVisibility = (uischema: UISchemaElement, data: any) => {
  // TODO condition evaluation should be done somewhere else
  if (!_.has(uischema, 'rule.condition')) {
    return true;
  }
  const condition = uischema.rule.condition as LeafCondition;
  const value = resolveData(data, toDataPath(condition.scope));
  const equals = value === condition.expectedValue;

  switch (uischema.rule.effect) {
    case RuleEffect.HIDE: return !equals;
    case RuleEffect.SHOW: return equals;
    default:
    // visible by default
    return true;
  }
};

export const evalEnablement = (uischema: UISchemaElement, data: any) => {

  if (!_.has(uischema, 'rule.condition')) {
    return true;
  }

  const condition = uischema.rule.condition as LeafCondition;
  const value = resolveData(data, toDataPath(condition.scope));
  const equals = value === condition.expectedValue;

  switch (uischema.rule.effect) {
    case RuleEffect.DISABLE: return !equals;
    case RuleEffect.ENABLE: return equals;
    default:
    // enabled by default
    return true;
  }
};

export const isVisible = (props, state) => {

  if (props.uischema.rule) {
    return evalVisibility(props.uischema, getData(state));
  }

  return true;
};

export const isEnabled = (props, state) => {

  if (props.uischema.rule) {
    return evalEnablement(props.uischema, getData(state));
  }

  return true;
};
