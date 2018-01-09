import * as React from 'react';
import {
  FieldProps,
  isIntegerControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialIntegerField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;
  const config = {'step': '1'};

  return (
    <Input
      type='number'
      value={data || ''}
      onChange={ev => handleChange(path, parseInt(ev.target.value, 10))}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      inputProps={config}
      fullWidth={true}
    />
  );
};
export const integerFieldTester: RankedTester = rankWith(2, isIntegerControl);
export default registerStartupInput(
    integerFieldTester,
    connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialIntegerField)
);
