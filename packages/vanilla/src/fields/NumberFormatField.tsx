import * as React from 'react';
import {
  connectToJsonForms,
  ControlElement,
  FieldProps,
  Formatted,
  isNumberFormatControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  resolveSchema
} from '@jsonforms/core';

const NumberFormatField = (props: FieldProps & Formatted<number>) => {
  const {
    className,
    id,
    enabled,
    uischema,
    schema,
    path,
    handleChange,
  } = props;
  const controlElement = uischema as ControlElement;
  const maxLength = resolveSchema(schema, controlElement.scope).maxLength;
  const formattedNumber: string = props.toFormatted(props.data);

  const onChange = ev => {
    const validStringNumber = props.fromFormatted(ev.currentTarget.value);
    handleChange(path, validStringNumber);
  };


  return (
    <input
      type='text'
      value={formattedNumber}
      onChange={onChange}
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

export default connectToJsonForms(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(NumberFormatField);
