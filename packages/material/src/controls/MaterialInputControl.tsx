import * as React from 'react';
import {
  computeLabel,
  Control,
  ControlElement,
  ControlProps,
  ControlState,
  DispatchField,
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  isErrorVisible,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
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
      parentPath
    } = this.props;
    let isValid = errors.length === 0;
    isValid = !isErrorVisible(isValid, errors, uischema);
    const trim = uischema.options && uischema.options.trim;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;
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
