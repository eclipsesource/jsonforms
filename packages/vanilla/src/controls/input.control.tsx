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
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
} from 'jsonforms-core';
import { connect } from 'react-redux';

export class InputControl extends Control<ControlProps, ControlState> {
  render() {
    const { classNames, id, errors, label, uischema, schema, visible, required } = this.props;
    const isValid = errors.length === 0;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const inputDescriptionClassName = 'input-description';
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
        {isDescriptionHidden(visible, description, this.state.isFocused) ? null : <p className={inputDescriptionClassName}>{description}</p>}
      </div>
    );
  }
};

export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(InputControl)
);
