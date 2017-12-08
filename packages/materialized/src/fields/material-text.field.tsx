import * as React from 'react';
import {
  ControlElement,
  FieldProps,
  handleChange,
  isControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialTextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope.$ref).maxLength;
  const config = {'maxLength': maxLength};
  const trim = uischema.options && uischema.options.trim;

  return <Input type='text'
    value={data || ''}
    onChange={ ev => handleChange(props, ev.target.value)}
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    multiline={uischema.options && uischema.options.multi}
    fullWidth={!trim}
    inputProps={config}
  />;
};
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isControl);
export default registerStartupInput(
  textFieldTester,
  connect(mapStateToInputProps)(MaterialTextField)
);
