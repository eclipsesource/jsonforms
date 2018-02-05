import * as React from 'react';
import { SyntheticEvent } from 'react';
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

const NumberFormatField = (props: FieldProps) => {
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    schema,
    path,
    handleChange,
    locale,
    numberSeparators
  } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope).maxLength;
  const formattedNumber =
    convertNumberToLocaleString(data, locale, numberSeparators.decimalSeparator);

  return (
    <input
      type='text'
      value={formattedNumber}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
        const numberRegex = /^[0-9\b.,]+$/;
        const validStringNumber = convertLocaleStringToValidStringNumber(ev, numberSeparators);
        if (ev.currentTarget.value === '' ||
          (!isNaN(Number(validStringNumber)) && numberRegex.test(validStringNumber))) {
          handleChange(path, validStringNumber);
        }
      }}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      maxLength={uischema.options && uischema.options.restrict ? maxLength : undefined}
      size={uischema.options && uischema.options.trim ? maxLength : undefined}
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
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(NumberFormatField)
);
