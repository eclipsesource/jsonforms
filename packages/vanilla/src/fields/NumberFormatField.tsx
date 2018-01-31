import * as React from 'react';
import { SyntheticEvent } from 'react';
import {
  ControlElement,
  FieldProps,
  formatNumber,
  isFomattedNumberControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  registerStartupField,
  rankWith,
  resolveSchema
} from '@jsonforms/core';
import { connect } from 'react-redux';
import * as _ from 'lodash';

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
    numberFormat,
    locale
  } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope).maxLength;
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

  return (
    <input
      type='text'
      value={formattedData}
      onChange={(ev: SyntheticEvent<HTMLInputElement>) => {
          const re = /^[0-9\b.,]+$/;
          if (ev.currentTarget.value === '' || re.test(ev.currentTarget.value)) {
            handleChange(path, ev.currentTarget.value);
          }
        }
      }
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
export const numberFormatFieldTester: RankedTester = rankWith(4, isFomattedNumberControl);

export default registerStartupField(
  numberFormatFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(NumberFormatField)
);
