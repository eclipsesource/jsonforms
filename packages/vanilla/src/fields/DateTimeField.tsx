import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isDateTimeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { SyntheticEvent } from 'react';

const DateTimeField = (props: FieldProps) => {
    const { data, className, id, enabled, uischema, path, handleChange } = props;
    const toISOString = (inputDateTime: string) => {
        return (inputDateTime === '' ? '' : inputDateTime + ':00.000Z');
    };

    return (
      <input
        type='datetime-local'
        value={(data || '').substr(0, 16)}
        onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
          handleChange(path, toISOString(ev.currentTarget.value))
        }
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
      />
    );
};
/**
 * Default tester for datetime controls.
 * @type {RankedTester}
 */
export const dateTimeFieldTester: RankedTester = rankWith(2, isDateTimeControl);
export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(DateTimeField);
