import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isDateControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialDateField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return (
    <Input
      type='date'
      value={data || ''}
      onChange={ ev =>
        handleChange(props, ev.target.value)
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      fullWidth={true}
    />
  );
};
export const dateFieldTester: RankedTester = rankWith(3, isDateControl);
export default registerStartupInput(
  dateFieldTester,
  connect(mapStateToInputProps)(MaterialDateField)
);
