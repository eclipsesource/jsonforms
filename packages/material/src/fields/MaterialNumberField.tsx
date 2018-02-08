import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isNumberControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

import Input from 'material-ui/Input';

export const MaterialNumberField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;
  const config = {'step': '0.1'};

  return (
    <Input
      type='number'
      value={data || ''}
      onChange={ev => handleChange(path, Number(ev.target.value))}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      inputProps={config}
      fullWidth={true}
    />
  );
};
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const materialNumberFieldTester: RankedTester = rankWith(2, isNumberControl);
export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialNumberField);
