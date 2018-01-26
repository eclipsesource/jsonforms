import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  FieldProps,
  isNumberControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField
} from '@jsonforms/core';
import { connect } from 'react-redux';

const NumberField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <input
      type='number'
      step='0.1'
      value={data || ''}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, Number(ev.currentTarget.value))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
    />
  );
};

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberFieldTester: RankedTester = rankWith(2, isNumberControl);

export default registerStartupField(
  numberFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(NumberField)
);
