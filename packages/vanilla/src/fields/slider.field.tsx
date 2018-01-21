import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  ControlElement,
  FieldProps,
  isRangeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupInput,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

const SliderField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
  const controlElement = uischema as ControlElement;
  const resolvedSchema = resolveSchema(schema, controlElement.scope);

  return (
  <div style={{display: 'flex'}}>
    <input
      type='range'
      max={resolvedSchema.maximum}
      min={resolvedSchema.minimum}
      value={data || (resolvedSchema.maximum - resolvedSchema.minimum) / 2}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, Number(ev.currentTarget.value))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      style={{flex: '1'}}
    />
    <label style={{marginLeft: '0.5em'}}>{data}</label>
  </div>
  );
};

export const sliderFieldTester: RankedTester = rankWith(4, isRangeControl);

export default registerStartupInput(
  sliderFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(SliderField)
);
