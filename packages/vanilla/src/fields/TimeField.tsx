import * as React from 'react';
import {
  FieldProps,
  isTimeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

const TimeField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return <input
    type='time'
    value={data || ''}
    onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
      handleChange(path, ev.currentTarget.value)
    }
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
  />;
};
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const timeFieldTester: RankedTester = rankWith(2, isTimeControl);

export default registerStartupInput(
  timeFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(TimeField)
);
