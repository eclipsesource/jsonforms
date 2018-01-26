import * as React from 'react';
import {
  computeLabel,
  Control,
  ControlState,
  DispatchField,
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { mapStateToVanillaControlProps, VanillaControlProps } from '../util';

export class InputControl extends Control<VanillaControlProps, ControlState> {
  render() {
    const {
      classNames,
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
    const divClassNames = 'validation' + (isValid ? ' ' + classNames.description : ' validation_error');
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);

    return (
      <div
        className={classNames.wrapper}
        hidden={!visible}
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
      >
        <label htmlFor={id} className={classNames.label}>
          {computeLabel(label, required)}
        </label>
      <DispatchField uischema={uischema} schema={schema} path={parentPath}/>
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
        </div>
      </div>
    );
  }
}

export const inputControlTester: RankedTester = rankWith(1, isControl);

export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToVanillaControlProps)(InputControl)
);
