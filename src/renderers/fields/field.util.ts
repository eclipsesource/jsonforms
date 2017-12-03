import * as _ from 'lodash';
import { ControlElement, UISchemaElement } from '../../models/uischema';
import { RankedTester } from '../../core/testers';
import { JsonForms } from '../../core';
import { isEnabled, isVisible } from '../../core/renderer';
import { composeWithUi, resolveData } from '../../path.util';
import { getData, getValidation } from '../../reducers/index';
import { Component } from '../../common/binding';
import { errorAt } from '../../reducers/validation';
import { Field, FieldProps } from './field';

export interface JsonFormsInputConstructable {
  // TODO: any state?
  new(props: FieldProps): Field<FieldProps, any>;
}

export const registerStartupInput = (tester: RankedTester, input: any) => {
  JsonForms.inputs.push({
    tester,
    input
  });

  return input;
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
