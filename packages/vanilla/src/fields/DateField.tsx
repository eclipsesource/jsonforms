import * as React from 'react';
import {
  FieldProps,
  isDateControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { SyntheticEvent } from 'react';
import { connectToJsonForms } from '@jsonforms/react';

const DateField = (props: FieldProps) => {
    const { data, className, id, enabled, uischema, path, handleChange } = props;

    return (
      <input
        type='date'
        value={data || ''}
        onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
          handleChange(path, ev.currentTarget.value)
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

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(DateField);
