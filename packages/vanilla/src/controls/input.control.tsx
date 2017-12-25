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
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const inputDescriptionClassName =
      JsonForms.stylingRegistry.getAsClassName('input-description');
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
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
        <div
          hidden={isDescriptionHidden(visible, description, this.state.isFocused)}
          className={inputDescriptionClassName}
        >
          {description}
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
