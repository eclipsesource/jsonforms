import * as React from 'react';
import {
  FieldProps,
  isDateControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import Input from 'material-ui/Input';

export const MaterialDateField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <Input
      type='date'
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
export const materialDateFieldTester: RankedTester = rankWith(2, isDateControl);
export default connectToJsonForms(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialDateField);
