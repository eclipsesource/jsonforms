import * as React from 'react';
import {
  computeLabel,
  ControlProps,
  ControlState,
  formatErrorMessage,
  isDateControl,
  isDescriptionHidden,
  isPlainLabel,
  isTimeControl,
  mapDispatchToControlProps,
  mapStateToControlProps,
  or,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { connectToJsonForms, Control } from '@jsonforms/react';
import TextField from 'material-ui/TextField';

export class MaterialNativeControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      errors,
      label,
      scopedSchema,
      description,
      visible,
      required,
      path,
      handleChange,
      data,
      config
    } = this.props;
    const isValid = errors.length === 0;
    const trim = config.trim;
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    const onChange = ev => handleChange(path, ev.target.value);
    const fieldType = scopedSchema.format;
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);

    return (
      <TextField
        id={id}
        label={computeLabel(isPlainLabel(label) ? label : label.default, required)}
        type={fieldType}
        error={!isValid}
        style={style}
        fullWidth={!trim}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        helperText={!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
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
