import * as React from 'react';
import {
  computeLabel,
  Control,
  ControlProps,
  ControlState,
  DispatchField,
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export class MaterialInputControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      errors,
      label,
      uischema,
      schema,
      visible,
      required,
      parentPath,
      description
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const style: {[x: string]: any} = {};
    if (!visible) {
      style.display = 'none';
    }
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);

    return (
      <FormControl
        style={style}
        fullWidth={!trim}
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
      >
        <InputLabel htmlFor={id} error={!isValid}>
          {computeLabel(label, required)}
        </InputLabel>
        <DispatchField uischema={uischema} schema={schema} path={parentPath} />
        <FormHelperText error={!isValid}>
          {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
        </FormHelperText>
      </FormControl>
    );
  }
}
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(MaterialInputControl)
);
