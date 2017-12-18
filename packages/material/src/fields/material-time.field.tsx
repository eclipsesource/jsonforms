import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isTimeControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialTimeField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <Input
    type='time'
    value={data || ''}
    onChange={ ev =>
      handleChange(props, ev.target.value)
    }
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    fullWidth
  />;
};
export const timeFieldTester: RankedTester = rankWith(3, isTimeControl);
export default registerStartupInput(
  timeFieldTester,
  connect(mapStateToInputProps)(MaterialTimeField)
);
