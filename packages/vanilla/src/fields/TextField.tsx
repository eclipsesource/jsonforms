import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isStringControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

const TextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, scopedSchema, path, handleChange } = props;
  const maxLength = scopedSchema.maxLength;

  return (
    <input
      type='text'
      value={data || ''}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, ev.currentTarget.value)
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      maxLength={uischema.options && uischema.options.restrict ? maxLength : undefined}
      size={uischema.options && uischema.options.trim ? maxLength : undefined}
    />
  );
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isStringControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(TextField);
