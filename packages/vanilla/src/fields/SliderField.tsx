import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isRangeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

const SliderField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, scopedSchema, path, handleChange } = props;

  return (
  <div style={{display: 'flex'}}>
    <input
      type='range'
      max={scopedSchema.maximum}
      min={scopedSchema.minimum}
      value={data || scopedSchema.default}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, Number(ev.currentTarget.value))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      style={{flex: '1'}}
    />
    <label style={{marginLeft: '0.5em'}}>{data || scopedSchema.default}</label>
  </div>
  );
};

export const sliderFieldTester: RankedTester = rankWith(4, isRangeControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(SliderField);
