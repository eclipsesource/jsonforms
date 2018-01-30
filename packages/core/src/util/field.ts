import * as _ from 'lodash';
import { ControlElement } from '../models/uischema';
import { RankedTester } from '../testers';
import { JsonForms } from '../core';
import { getData, getErrorAt } from '../reducers';
import {
  composeWithUi,
  StatePropsOfField,
  isEnabled,
  isVisible,
  Resolve
} from '../util';
import { mapDispatchToControlProps } from './renderer';
import { DispatchPropsOfControl } from '../renderers';

/**
 * Registers the given field renderer when a JSON Forms store is created.
 * @param {RankedTester} tester
 * @param field the field to be registered
 * @returns {any}
 */
export const registerStartupField = (tester: RankedTester, field: any) => {
  JsonForms.fields.push({
    tester,
    field
  });

  return field;
};

/**
 * Map state to field props.
 *
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfField} state props of a field
 */
export const mapStateToFieldProps = (state, ownProps): StatePropsOfField => {
  const path = composeWithUi(ownProps.uischema, ownProps.path);
  const visible = _.has(ownProps, 'visible') ? ownProps.visible : isVisible(ownProps, state);
  const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : isEnabled(ownProps, state);
  const errors = getErrorAt(path)(state).map(error => error.message);
  const isValid = _.isEmpty(errors);
  const controlElement = ownProps.uischema as ControlElement;
  const id = controlElement.scope || '';
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

  return {
    data: Resolve.data(getData(state), path),
    className: inputClassName.join(' '),
    visible,
    enabled,
    id,
    path,
    isValid,
    uischema: ownProps.uischema,
    schema: ownProps.schema
  };
};

/**
 * Synonym for mapDispatchToControlProps.
 *
 * @type {(dispatch) => {handleChange(path, value): void}}
 */
export const mapDispatchToFieldProps: (dispatch) => DispatchPropsOfControl =
  mapDispatchToControlProps;
