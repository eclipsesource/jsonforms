import * as React from 'react';
import {
  ControlElement,
  FieldProps,
  formatNumber,
  isFomattedNumberControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';
import * as _ from 'lodash';
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
    numberFormat,
    locale
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
  let formattedData = '';
  if (data) {
    /**
     * Tests whether the last character of data is integer or not
     */

    if (isNaN(parseInt(_.last(data), 10))) {
      formattedData = data;
    } else {
      formattedData = formatNumber(data, locale, numberFormat);
    }
  }
  const onChange = ev => {
    const re = /^[0-9\b.,]+$/;
    if (ev.currentTarget.value === '' || re.test(ev.currentTarget.value)) {
      handleChange(path, ev.currentTarget.value);
    }
  };

  return (
    <Input
      type='text'
      value={formattedData || ''}
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
export const numberFormatFieldTester: RankedTester = rankWith(4, isFomattedNumberControl);
export default registerStartupField(
  numberFormatFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialNumberFormatField)
);
