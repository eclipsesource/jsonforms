import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  isIntegerControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';

const IntegerField  = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <input
      type='number'
      step='1'
      value={data || ''}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, parseInt(ev.currentTarget.value, 10))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
    />
  );
};
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerFieldTester: RankedTester = rankWith(2, isIntegerControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(IntegerField);
