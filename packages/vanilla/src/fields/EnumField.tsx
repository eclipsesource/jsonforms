import * as React from 'react';
import {
  ControlElement,
  FieldProps,
  isEnumControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { SyntheticEvent } from 'react';

const EnumField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
  const options = resolveSchema(schema, (uischema as ControlElement).scope).enum;

  return (
    <select
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      value={data || ''}
      onChange={(ev: SyntheticEvent<HTMLSelectElement>) =>
        handleChange(path, ev.currentTarget.value)
      }
    >
      {
        [<option value='' key={'empty'} />]
          .concat(
            options.map(optionValue =>
              (
                <option value={optionValue} label={optionValue} key={optionValue}>
                  {optionValue}
                </option>
              )
            )
          )}
    </select>
  );
};
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumFieldTester: RankedTester = rankWith(2, isEnumControl);

export default registerStartupField(
  enumFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(EnumField)
);
