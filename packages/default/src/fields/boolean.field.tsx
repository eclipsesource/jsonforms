import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isBooleanControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

const BooleanFd = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return (
    <input type='checkbox'
           checked={data || ''}
           onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
             handleChange(props, ev.currentTarget.checked)
           }
           className={className}
           id={id}
           disabled={!enabled}
           autoFocus={uischema.options && uischema.options.focus}
    />
  );
};

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanFieldTester: RankedTester = rankWith(2, isBooleanControl);
export const BooleanField = registerStartupInput(
  booleanFieldTester,
  connect(mapStateToInputProps)(BooleanFd)
);
export default BooleanField;
