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
  isStringControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import Input from 'material-ui/Input';

export const MaterialTextField = (props: FieldProps) => {
  const {
    data,
    config,
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
  let inputProps;
  if (config.restrict) {
    inputProps = {'maxLength': maxLength};
  } else {
    inputProps = {};
  }
  if (config.trim && maxLength !== undefined) {
    inputProps.size = maxLength;
  }
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
      fullWidth={!config.trim || maxLength === undefined}
      inputProps={inputProps}
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
