import * as React from 'react';
import {
  ControlProps,
  DispatchField,
  formatErrorMessage,
  isControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer
} from 'jsonforms-core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const MaterializedControl =
  ({ classNames, id, errors, label, uischema, schema, visible }: ControlProps) => {
  const isValid = errors.length === 0;

  return (
    <FormControl className={classNames.wrapper} hidden={!visible} fullWidth>
      <InputLabel htmlFor={id} className={classNames.label}>{label}</InputLabel>
      <DispatchField uischema = {uischema} schema = {schema}/>
      <FormHelperText error={!isValid}>{errors}</FormHelperText>
    </FormControl>
  );
};

export default registerStartupRenderer(
  rankWith(2, isControl),
  connect(mapStateToControlProps)(MaterializedControl)
);
