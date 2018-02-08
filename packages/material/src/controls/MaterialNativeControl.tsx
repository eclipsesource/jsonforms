import * as React from 'react';
import {
  computeLabel,
  connectToJsonForms,
  Control,
  ControlElement,
  ControlProps,
  ControlState,
  isDateControl,
  isTimeControl,
  mapDispatchToControlProps,
  mapStateToControlProps,
  or,
  RankedTester,
  rankWith,
  resolveSchema
} from '@jsonforms/core';

import TextField from 'material-ui/TextField';

export class MaterialNativeControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      errors,
      label,
      uischema,
      schema,
      visible,
      required,
      path,
      handleChange,
      data
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    const onChange = ev => handleChange(path, ev.target.value);
    const fieldType = resolvedSchema.format;

    return (
      <TextField
        id={id}
        label={computeLabel(label, required)}
        type={fieldType}
        error={!isValid}
        style={style}
        fullWidth={!trim}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        helperText={!isValid ? errors : description}
        InputLabelProps={{shrink: true}}
        value={data}
        onChange={onChange}
      />
    );
  }
}

export const materialNativeControlTester: RankedTester = rankWith(
  2,
  or(isDateControl, isTimeControl)
);

export default connectToJsonForms(
  mapStateToControlProps,
  mapDispatchToControlProps
)(MaterialNativeControl);
