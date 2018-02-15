import * as React from 'react';
import {
  connectToJsonForms,
  FieldProps,
  isStringControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

import Input from 'material-ui/Input';

export const MaterialTextField = (props: FieldProps) => {
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    isValid,
    path,
    handleChange,
    scopedSchema
  } = props;
  const maxLength = scopedSchema.maxLength;
  let config;
  if (uischema.options && uischema.options.restrict) {
    config = {'maxLength': maxLength};
  } else {
    config = {};
  }
  const trim = uischema.options && uischema.options.trim;
  const onChange = ev => handleChange(path, ev.target.value);

  return (
    <Input
      type='text'
      value={data || ''}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      multiline={uischema.options && uischema.options.multi}
      fullWidth={!trim || maxLength === undefined}
      inputProps={config}
      error={!isValid}
    />
  );
};
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const materialTextFieldTester: RankedTester = rankWith(1, isStringControl);
export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialTextField);
