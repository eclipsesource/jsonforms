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
import React from 'react';
import {
  FieldProps,
  isStringControl,
  mapDispatchToFieldProps,
  mapStateToFieldProps,
  RankedTester,
  rankWith,
  WithClassname
} from '@jsonforms/core';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux';
import merge from 'lodash/merge';

export const MaterialTextField = (props: FieldProps & WithClassname) => {
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
    schema
  } = props;
  const maxLength = schema.maxLength;
  const mergedConfig = merge({}, config, uischema.options);
  let inputProps: any;
  if (mergedConfig.restrict) {
    inputProps = {'maxLength': maxLength};
  } else {
    inputProps = {};
  }
  if (mergedConfig.trim && maxLength !== undefined) {
    inputProps.size = maxLength;
  }
  const onChange = (ev: any) => handleChange(path, ev.target.value);

  return (
    <Input
      type={uischema.options && (uischema.options.format === 'password') ? 'password' : 'text'}
      value={data || ''}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      multiline={uischema.options && uischema.options.multi}
      fullWidth={!mergedConfig.trim || maxLength === undefined}
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
export default connect(
  mapStateToFieldProps,
  mapDispatchToFieldProps
)(MaterialTextField);
