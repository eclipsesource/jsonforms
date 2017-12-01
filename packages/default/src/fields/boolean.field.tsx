import * as React from 'react';
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
import { SyntheticEvent } from 'react';

export const BooleanField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return (
    <input type='checkbox'
           checked={data || ''}
           onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
             handleChange(props, ev.currentTarget.checked)
           }
           className={className}
           id={id}
           disabled={!enabled}
           autoFocus={uischema.options && uischema.options.focus}
    />
  );
};

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanFieldTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));
export default registerStartupInput(
  booleanFieldTester,
  connect(mapStateToInputProps)(BooleanField)
);
