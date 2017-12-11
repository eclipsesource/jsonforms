import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  handleChange,
  isNumberControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';

const NumberField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='number'
       step='0.1'
       value={data || ''}
       onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
         handleChange(props, Number(ev.currentTarget.value))
       }
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
  />;
};

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberFieldTester: RankedTester = rankWith(2, isNumberControl);

export default registerStartupInput(
  numberFieldTester,
  connect(mapStateToInputProps)(NumberField)
);
