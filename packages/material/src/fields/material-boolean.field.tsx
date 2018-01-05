import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isBooleanControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Checkbox from 'material-ui/Checkbox';

export const MaterialBooleanField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return (
    <Checkbox
      checked={data || ''}
      onChange={(_ev, checked) => handleChange(props, checked)}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
    />
  );
};

export const booleanFieldTester: RankedTester = rankWith(2, isBooleanControl);
export default registerStartupInput(
  booleanFieldTester,
  connect(mapStateToInputProps)(MaterialBooleanField)
);
