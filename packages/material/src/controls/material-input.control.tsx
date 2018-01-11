import * as React from 'react';
import {
  computeLabel,
  ControlProps,
  DispatchField,
  isControl,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';
import { connect } from 'react-redux';

import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const MaterialInputControl =
  ({ classNames, id, errors, label, uischema, schema, visible, required }: ControlProps) => {
  const isValid = errors.length === 0;
  const trim = uischema.options && uischema.options.trim;

  let style = {};
  if (!visible) {
    style = {display: 'none'};
  }

  return (
    <FormControl className={classNames.wrapper} style={style} fullWidth={!trim}>
      <InputLabel htmlFor={id} className={classNames.label} error={!isValid}>
        {computeLabel(label, required)}
      </InputLabel>
      <DispatchField uischema={uischema} schema={schema}/>
      <FormHelperText error={!isValid}>{errors}</FormHelperText>
    </FormControl>
  );
};
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(MaterialInputControl)
);
