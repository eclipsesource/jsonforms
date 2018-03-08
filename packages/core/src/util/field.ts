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
import { ControlElement } from '../models/uischema';
import { getConfig, getData, getErrorAt } from '../reducers';
import { RankedTester } from '../testers';
import {
  composeWithUi,
  isEnabled,
  isVisible,
  Resolve,
  StatePropsOfField
} from '../util';
import {
  DispatchPropsOfControl,
  mapDispatchToControlProps,
  StatePropsOfScopedRenderer
} from './renderer';

/**
 * State props of a field.
 */
export interface StatePropsOfField extends StatePropsOfScopedRenderer {
  className?: string;
  isValid: boolean;
}

/**
 * Props of a field.
 */
export interface FieldProps extends StatePropsOfField, DispatchPropsOfControl {

}
/**
 * Registers the given field renderer when a JSON Forms store is created.
 * @param {RankedTester} tester
 * @param field the field to be registered
 * @returns {any}
 */
export interface DispatchFieldProps extends FieldProps {
  fields?: { tester: RankedTester, field: any }[];
}
export const mapStateToDispatchFieldProps = state => ({
  fields: state.jsonforms.fields || []
});
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
  const defaultConfig = _.cloneDeep(getConfig(state));
  const config = _.merge(
    defaultConfig,
    ownProps.uischema.options
  );

  return {
    data: Resolve.data(getData(state), path),
    className: inputClassName.join(' '),
    visible,
    enabled,
    id,
    path,
    isValid,
    scopedSchema: Resolve.schema(ownProps.schema, controlElement.scope),
    uischema: ownProps.uischema,
    schema: ownProps.schema,
    config
  };
};

/**
 * Synonym for mapDispatchToControlProps.
 *
 * @type {(dispatch) => {handleChange(path, value): void}}
 */
export const mapDispatchToFieldProps: (dispatch) => DispatchPropsOfControl =
  mapDispatchToControlProps;
