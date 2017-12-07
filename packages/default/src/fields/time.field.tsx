import * as React from 'react';
import {
  and,
  FieldProps,
  formatIs,
  handleChange,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  uiTypeIs
} from 'jsonforms-core';
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
export const timeFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  formatIs('time')
));

export default registerStartupInput(
  timeFieldTester,
  connect(mapStateToInputProps)(TimeField)
);
