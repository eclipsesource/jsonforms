import { Component } from 'react';
import * as _ from 'lodash';
import { ControlElement, UISchemaElement } from '../models/uischema';
import { RankedTester } from '../testers';
import { JsonForms } from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { getConfig, getData, getErrorAt } from '../reducers';
import {
  composeWithUi,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { isErrorVisible, mapDispatchToControlProps } from './renderer';

export interface JsonFormsFieldConstructable {
  new(props: FieldProps): Component<FieldProps, any>;
}
export interface FieldProps {
  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;
  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;
  data: any;
  className?: string;
  id: string;
  visible?: boolean;
  enabled: boolean;
  dispatch: any;
  isValid: boolean;
  config: any;

  handleChange(string, any): (void);
}
export const registerStartupField = (tester: RankedTester, field: any) => {
  JsonForms.fields.push({
    tester,
    field
  });

  return field;
};
export const mapStateToFieldProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible : isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : isEnabled(ownProps, state);
  const errors = getErrorAt(path)(state).map(error => error.message);
  const isValid = !isErrorVisible(_.isEmpty(errors), errors, ownProps.uischema);
  const controlElement = ownProps.uischema as ControlElement;
  const id = controlElement.scope || '';
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');
  const config = getConfig(state);

  return {
    data: Resolve.data(getData(state), path),
    className: inputClassName.join(' '),
    visible,
    enabled,
    id,
    path,
    isValid,
    config
  };
};
export const mapDispatchToFieldProps = mapDispatchToControlProps;
