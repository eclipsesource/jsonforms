import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  connectToJsonForms,
  ControlElement,
  FieldProps,
  isRangeControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  resolveSchema
} from '@jsonforms/core';

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
      value={data || resolvedSchema.default}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) =>
        handleChange(path, Number(ev.currentTarget.value))
      }
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      style={{flex: '1'}}
    />
    <label style={{marginLeft: '0.5em'}}>{data || resolvedSchema.default}</label>
  </div>
  );
};

export const sliderFieldTester: RankedTester = rankWith(4, isRangeControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(SliderField);
