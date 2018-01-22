import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  isMultiLineControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from '@jsonforms/core';
import { connect } from 'react-redux';

export const TextAreaField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return <textarea
       value={data || ''}
       onChange={(ev: SyntheticEvent<HTMLTextAreaElement>) =>
         handleChange(path, ev.currentTarget.value)
       }
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
export const textAreaFieldTester: RankedTester = rankWith(2, isMultiLineControl);

export default registerStartupInput(
  textAreaFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(TextAreaField)
);
