import * as _ from 'lodash';
import { ControlElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { getConfig, getData, getErrorAt } from '../reducers';
import {
  composeWithUi,
  isEnabled,
  isVisible,
  Resolve,
  StatePropsOfField
} from '../util';
import { mapDispatchToControlProps } from './renderer';
import { DispatchPropsOfControl } from '../renderers';

/**

export interface DispatchFieldProps extends FieldProps {
  fields?: { tester: RankedTester, field: any }[];
}
export const mapStateToDispatchFieldProps = state => ({
  fields: state.jsonforms.fields || []
});
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
