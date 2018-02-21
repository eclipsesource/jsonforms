import * as React from 'react';
import {
  FieldProps,
  Formatted,
  isNumberFormatControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import Input from 'material-ui/Input';

const MaterialNumberFormatField = (props: FieldProps & Formatted<number>) => {
  const {
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
  const formattedNumber = props.toFormatted(props.data);

  const onChange = ev => {
    const validStringNumber = props.fromFormatted(ev.currentTarget.value);
    handleChange(path, validStringNumber);
  };

  return (
    <Input
      type='text'
      value={formattedNumber}
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
export const materialNumberFormatFieldTester: RankedTester = rankWith(4, isNumberFormatControl);
export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialNumberFormatField);
