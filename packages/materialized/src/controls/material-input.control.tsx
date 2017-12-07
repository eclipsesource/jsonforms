import * as React from 'react';
import {
  computeLabel,
  ControlProps,
  DispatchField,
  isControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer
} from 'jsonforms-core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const MaterialInputControl =
  ({ classNames, id, errors, label, uischema, schema, visible, required }: ControlProps) => {
  const isValid = errors.length === 0;

  return (
    <FormControl className={classNames.wrapper} hidden={!visible} fullWidth>
      <InputLabel htmlFor={id} className={classNames.label}>{computeLabel(label, required)}</InputLabel>
      <DispatchField uischema = {uischema} schema = {schema}/>
      <FormHelperText error={!isValid}>{errors}</FormHelperText>
    </FormControl>
  );
};

export default registerStartupRenderer(
  rankWith(2, isControl),
  connect(mapStateToControlProps)(MaterialInputControl)
);
