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
  schemaTypeIs,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

export const NumberField = (props: FieldProps) => {
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
export const numberFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaTypeIs('number')
));

export default registerStartupInput(
  numberFieldTester,
  connect(mapStateToInputProps)(NumberField)
);
