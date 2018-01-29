import * as React from 'react';
import {
  ControlElement,
  FieldProps,
  isRangeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

const MaterialSliderField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
  const controlElement = uischema as ControlElement;
  const resolvedSchema = resolveSchema(schema, controlElement.scope);
  const config = {'max': resolvedSchema.maximum, 'min': resolvedSchema.minimum};

  return (
    <Input
      type='range'
      value={data || resolvedSchema.default}
      onChange={ev => handleChange(path, Number(ev.currentTarget.value))}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      inputProps={config}
      endAdornment={<label style={{marginLeft: '0.5em'}}>{data || resolvedSchema.default}</label>}
    />
  );
};

/**
 * Matrial tester for slider controls.
 * @type {RankedTester}
 */
export const sliderFieldTester: RankedTester = rankWith(4, isRangeControl);

export default registerStartupField(
  sliderFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialSliderField)
);
