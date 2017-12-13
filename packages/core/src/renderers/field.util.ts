import { Component } from 'react';
import * as _ from 'lodash';
import { ControlElement, UISchemaElement } from '../models/uischema';
import { RankedTester } from '../testers';
import { JsonForms } from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { isEnabled, isVisible } from '../core/renderer';
import { composeWithUi } from '../path.util';
import { resolveData } from '../resolvers';
import { getData, getValidation } from '../reducers';
import { errorAt } from '../reducers/validation';
import { update } from '../actions';

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
}
export const registerStartupInput = (tester: RankedTester, field: any) => {
  JsonForms.fields.push({
    tester,
    field
  });

  return field;
};
export const mapStateToInputProps = (state, ownProps) => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible : isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : isEnabled(ownProps, state);
  const errors = errorAt(path)(getValidation(state)).map(error => error.message);
  const isValid = _.isEmpty(errors);
  const controlElement = ownProps.uischema as ControlElement;
  const id = _.has(controlElement.scope, '$ref') ? controlElement.scope.$ref : '';
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

  return {
    data: resolveData(getData(state), path),
    className: inputClassName.join(' '),
    visible,
    enabled,
    id,
    path
  };
};
export const handleChange = (props, value) => props.dispatch(update(props.path, () => value));
