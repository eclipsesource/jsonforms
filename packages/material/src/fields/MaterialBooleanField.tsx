import * as React from 'react';
import {
  FieldProps,
  isBooleanControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Checkbox from 'material-ui/Checkbox';

export const MaterialBooleanField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <Checkbox
      checked={data || ''}
      onChange={(_ev, checked) => handleChange(path, checked)}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
    />
  );
};

export const booleanFieldTester: RankedTester = rankWith(2, isBooleanControl);

const ConnectedMaterialBooleanField = connect(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialBooleanField);

registerStartupField(booleanFieldTester, ConnectedMaterialBooleanField);

export default ConnectedMaterialBooleanField;
