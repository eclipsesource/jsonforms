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
import { SyntheticEvent } from 'react';

const TimeField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input
    type='time'
    value={data || ''}
    onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
      handleChange(props, ev.currentTarget.value)
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
  connect(mapStateToInputProps)(TimeField)
);
