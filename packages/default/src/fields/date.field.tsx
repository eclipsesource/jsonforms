import * as React from 'react';
import {
  and,
  FieldProps,
  handleChange,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  formatIs,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

export const DateField = (props: FieldProps) => {
    const { data, className, id, enabled, uischema } = props;

    return <input type='date'
         value={data || ''}
         onChange={(ev: SyntheticEvent<HTMLInputElement>) => handleChange(props, ev.currentTarget.value)}
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
    />;
};
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  formatIs('date')
));

export default registerStartupInput(
  dateFieldTester,
  connect(mapStateToInputProps)(DateField)
);
