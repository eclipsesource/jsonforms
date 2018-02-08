import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isBooleanControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
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

export const materialBooleanFieldTester: RankedTester = rankWith(2, isBooleanControl);

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialBooleanField);
