import * as _ from 'lodash';
import Component from 'inferno-component';
import { JsonSchema } from '../models/jsonSchema';
import { LeafCondition, RuleEffect, Scopable, UISchemaElement } from '../models/uischema';
import { getValuePropertyPair } from '../path.util';
import { JsonFormsStore } from '../json-forms';
import { getData } from '../reducers/index';

export const convertToClassName = (value: string): string => {
  let result = value.replace('#', 'root');
  result = result.replace(new RegExp('/', 'g'), '_');

  return result;
};

export const getValue = (data: any, controlElement: Scopable, prefix = ''): any => {

  if (_.isEmpty(controlElement)) {
    return undefined;
  }

  const path = _.isEmpty(prefix) ?
    controlElement.scope.$ref :
    prefix + controlElement.scope.$ref.substr(1);

  const pair = getValuePropertyPair(data, path);

  if (pair.property === undefined) {
    return pair.instance;
  }

  return pair.instance[pair.property];
};

// TODO
export interface RendererProps {
  uischema: UISchemaElement;
  store: JsonFormsStore;
  schema: JsonSchema;
}

export interface RendererState {
  selected?: any;
}

/**
 * A renderer is a regular HTMLElement that has a render method which will
 * manipulate the underlying document when called. It also provides several
 * lifecycle hooks.
 */
export class Renderer extends Component<RendererProps, RendererState> {

}

// TODO: pass in uischema and data instead of props and state
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

export const evalVisibility = (uischema: UISchemaElement, data: any) => {
  // TODO condition evaluation should be done somewhere else

  if (!_.has(uischema, 'rule.condition')) {
    return true;
  }

  const condition = uischema.rule.condition as LeafCondition;
  const ref = condition.scope.$ref;
  const pair = getValuePropertyPair(data, ref);
  const value = pair.instance[pair.property];
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

  // TODO condition evaluation should be done somewhere else
  const condition = uischema.rule.condition as LeafCondition;
  const ref = condition.scope.$ref;
  const pair = getValuePropertyPair(data, ref);
  const value = pair.instance[pair.property];
  const equals = value === condition.expectedValue;

  switch (uischema.rule.effect) {
    case RuleEffect.DISABLE: return !equals;
    case RuleEffect.ENABLE: return equals;
    default:
      // enabled by default
      return true;
  }
};
