import * as React from 'react';
import {
  ControlElement,
  FieldProps,
  isStringControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialTextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema, schema, isValid, path, handleChange,
    config } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope).maxLength;
  let configuration;
  if (config.restrict) {
    configuration = {'maxLength': maxLength};
  } else {
    configuration = {};
  }
  const trim = config.trim;
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
      inputProps={configuration}
      error={!isValid}
    />
  );
};
/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isStringControl);
export default registerStartupField(
  textFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialTextField)
);
