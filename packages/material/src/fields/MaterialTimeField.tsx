import * as React from 'react';
import {
  FieldProps,
  isTimeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialTimeField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <Input
      type='time'
      value={data || ''}
      onChange={ev => handleChange(path, ev.target.value)}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      fullWidth={true}
    />
    );
};
export const timeFieldTester: RankedTester = rankWith(2, isTimeControl);
export default registerStartupField(
  timeFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialTimeField)
);
