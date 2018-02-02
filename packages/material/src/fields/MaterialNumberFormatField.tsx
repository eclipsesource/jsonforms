import * as React from 'react';
import {
  ControlElement,
  convertLocaleStringToValidStringNumber,
  convertNumberToLocaleString,
  FieldProps,
  isNumberFormatControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';
import Input from 'material-ui/Input';

export const MaterialNumberFormatField = (props: FieldProps) => {
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    schema,
    isValid,
    path,
    handleChange,
    locale,
    numberSeparators
  } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope).maxLength;
  let config;
  if (uischema.options && uischema.options.restrict) {
    config = {'maxLength': maxLength};
  } else {
    config = {};
  }
  const trim = uischema.options && uischema.options.trim;
  const formattedNumber =
    convertNumberToLocaleString(data, locale, numberSeparators.decimalSeparator);

  const onChange = ev => {
    const numberRegex = /^[0-9\b.,]+$/;
    const validStringNumber = convertLocaleStringToValidStringNumber(ev, numberSeparators);
    if (ev.currentTarget.value === '' ||
      (!isNaN(Number(validStringNumber)) && numberRegex.test(validStringNumber))) {
      handleChange(path, validStringNumber);
    }
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
export const numberFormatFieldTester: RankedTester = rankWith(4, isNumberFormatControl);
export default registerStartupField(
  numberFormatFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialNumberFormatField)
);
