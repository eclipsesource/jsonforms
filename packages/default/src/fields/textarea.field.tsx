import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  and,
  FieldProps,
  handleChange,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  optionIs,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

export const TextAreaField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <textarea
       value={data || ''}
       onChange={(ev: SyntheticEvent<HTMLTextAreaElement>) => handleChange(props, ev.currentTarget.value)}
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
     />;
};

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  optionIs('multi', true)
));

export default registerStartupInput(
  textAreaFieldTester,
  connect(mapStateToInputProps)(TextAreaField)
);
