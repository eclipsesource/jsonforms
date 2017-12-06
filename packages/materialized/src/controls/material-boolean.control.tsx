import * as React from 'react';
import {
  ControlProps,
  isBooleanControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer
} from 'jsonforms-core';
import { connect } from 'react-redux';

import { FormControlLabel } from 'material-ui/Form';

import MaterialBooleanField from '../fields/material-boolean.field';

export const MaterialBooleanControl =
    ({ classNames, id, errors, label, uischema, schema }: ControlProps) => {
    const isValid = errors.length === 0;

    return (
      <FormControlLabel className={classNames.wrapper} label={label}
      control={<MaterialBooleanField uischema = {uischema} schema = {schema}/>}
      />
    );
  };

export default registerStartupRenderer(
  rankWith(2, isBooleanControl),
  connect(mapStateToControlProps)(MaterialBooleanControl)
);
