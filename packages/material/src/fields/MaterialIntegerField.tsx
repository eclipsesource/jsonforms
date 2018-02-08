import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isIntegerControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';

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
export const materialIntegerFieldTester: RankedTester = rankWith(2, isIntegerControl);
export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialIntegerField);
