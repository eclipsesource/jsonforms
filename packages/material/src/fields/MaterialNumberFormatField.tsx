/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
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
