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
  JsonForms,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

export class InputControl extends Control<ControlProps, ControlState> {
  render() {
    const { classNames, id, errors, label, uischema, schema, visible, required } = this.props;
    const isValid = errors.length === 0;
    const inputDescriptionClassName =
      JsonForms.stylingRegistry.getAsClassName('input-description');
    const divClassNames = 'validation' + (isValid ? ' ' + inputDescriptionClassName : ' validation_error');
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;

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
        <DispatchField uischema={uischema} schema={schema}/>
        <div
          className={divClassNames}
          hidden={isValid && isDescriptionHidden(visible, description, this.state.isFocused)}
        >
          {!isValid ? formatErrorMessage(errors) : description}
        </div>
      </div>
    );
  }
};

export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(InputControl)
);
