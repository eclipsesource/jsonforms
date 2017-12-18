import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isDateControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

const DateField = (props: FieldProps) => {
    const { data, className, id, enabled, uischema } = props;

    return (
      <input
        type='date'
        value={data || ''}
        onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
          handleChange(props, ev.currentTarget.value)
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
export const dateFieldTester: RankedTester = rankWith(2, isDateControl);

export default registerStartupInput(
  dateFieldTester,
  connect(mapStateToInputProps)(DateField)
);
