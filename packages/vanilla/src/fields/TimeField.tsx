import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isTimeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { SyntheticEvent } from 'react';

const TimeField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <input
      type='time'
      value={data || ''}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, ev.currentTarget.value)
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
    />
  );
};
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const timeFieldTester: RankedTester = rankWith(2, isTimeControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(TimeField);
