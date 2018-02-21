import * as React from 'react';
import {
  ControlProps,
  isBooleanControl,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';

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

const ConnectedMaterialBooleanControl = connectToJsonForms(
  mapStateToControlProps
)(MaterialBooleanControl);

export const materialBooleanControlTester: RankedTester = rankWith(2, isBooleanControl);
export default ConnectedMaterialBooleanControl;
