import * as React from 'react';
import {
  computeLabel,
  Control,
  ControlElement,
  ControlProps,
  ControlState,
  DispatchField,
  isControl,
  isDescriptionHidden,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  resolveSchema
} from 'jsonforms-core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export class MaterialInputControl extends Control<ControlProps, ControlState> {
  render() {
    const { classNames, id, errors, label, uischema, schema, visible, required } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const description = resolvedSchema.description === undefined ? '' : resolvedSchema.description;

    return (
      <FormControl
        className={classNames.wrapper}
        hidden={!visible}
        fullWidth={!trim}
        onFocus={() => this.onFocus()}
        onBlur={() => this.onBlur()}
      >
        <InputLabel htmlFor={id} className={classNames.label} error={!isValid}>
          {computeLabel(label, required)}
        </InputLabel>
        <DispatchField uischema={uischema} schema={schema}/>
        <FormHelperText error={!isValid}>{errors}</FormHelperText>
        {isDescriptionHidden(visible, description, this.state.isFocused) ? null : <FormHelperText error={false}>{description}</FormHelperText>}
      </FormControl>
    );
  }
};
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(MaterialInputControl)
);
