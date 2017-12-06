import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  handleChange,
  isControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';

const TextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='text'
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
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isControl);

export default registerStartupInput(
  textFieldTester,
  connect(mapStateToInputProps)(TextField)
);
