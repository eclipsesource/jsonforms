import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialTextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <Input type='text'
    value={data || ''}
    onChange={ ev => handleChange(props, ev.target.value)}
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    multiline={uischema.options && uischema.options.multi}
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
