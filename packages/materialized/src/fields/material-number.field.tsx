import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isNumberControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialNumberField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;
  const config = {'step': '0.1'};

  return <Input type='number'
    value={data || ''}
    onChange={ev => handleChange(props, Number(ev.target.value))}
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    inputProps={config}
    fullWidth
  />;
};
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberFieldTester: RankedTester = rankWith(2, isNumberControl);
export default registerStartupInput(
    numberFieldTester,
    connect(mapStateToInputProps)(MaterialNumberField)
);
