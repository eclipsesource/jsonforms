import * as React from 'react';
import {
  connectToJsonForms,
  ControlProps,
  isBooleanControl,
  mapStateToControlProps,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';

import { FormControlLabel } from 'material-ui/Form';

import MaterialBooleanField from '../fields/MaterialBooleanField';

export const MaterialBooleanControl =
  ({  label, uischema, schema, visible, parentPath }: ControlProps) => {
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }

    return (
      <FormControlLabel
        style={style}
        label={label}
        control={<MaterialBooleanField uischema={uischema} schema={schema} path={parentPath}/>}
      />
    );
  };

export default registerStartupRenderer(
  rankWith(2, isBooleanControl),
  connectToJsonForms(mapStateToControlProps)(MaterialBooleanControl)
);
