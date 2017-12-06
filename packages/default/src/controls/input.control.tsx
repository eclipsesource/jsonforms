import * as React from 'react';
import {
  ControlProps,
  DispatchField,
  formatErrorMessage,
  isControl,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from 'jsonforms-core';
import { connect } from 'react-redux';

export const InputControl =
  ({ classNames, id, errors, label, uischema, schema, visible }: ControlProps) => {
  const isValid = errors.length === 0;
  const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <label htmlFor={id} className={classNames.label}>
        {label}
      </label>
      <DispatchField uischema={uischema} schema={schema}/>
      <div className={divClassNames}>
        {!isValid ? formatErrorMessage(errors) : ''}
      </div>
    </div>
  );
};
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(InputControl)
);
