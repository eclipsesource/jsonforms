import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  handleChange,
  isIntegerControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

const IntegerField  = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='number'
       step='1'
       value={data || ''}
       onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
         handleChange(props, parseInt(ev.currentTarget.value, 10))
       }
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
       />;
};
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerFieldTester: RankedTester = rankWith(2, isIntegerControl);

export default registerStartupInput(
  integerFieldTester,
  connect(mapStateToInputProps)(IntegerField)
);
