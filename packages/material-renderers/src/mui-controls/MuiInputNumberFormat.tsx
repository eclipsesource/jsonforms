/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
import React, { useCallback } from 'react';
import { CellProps, Formatted, WithClassname } from '@jsonforms/core';
import { Input } from '@mui/material';
import merge from 'lodash/merge';
import { useDebouncedChange } from '../util';

export const MuiInputNumberFormat = React.memo(function MuiInputNumberFormat(
  props: CellProps & WithClassname & Formatted<number>
) {
  const {
    className,
    id,
    enabled,
    uischema,
    isValid,
    path,
    handleChange,
    schema,
    config,
  } = props;
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  let inputProps;
  if (appliedUiSchemaOptions.restrict) {
    inputProps = { maxLength: maxLength };
  } else {
    inputProps = {};
  }
  const formattedNumber = props.toFormatted(props.data);

  const validStringNumber = useCallback(
    (ev: any) => props.fromFormatted(ev.currentTarget.value),
    [props.fromFormatted]
  );
  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    '',
    formattedNumber,
    path,
    validStringNumber
  );

  return (
    <Input
      type='text'
      value={inputValue}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      multiline={appliedUiSchemaOptions.multi}
      fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
      inputProps={inputProps}
      error={!isValid}
    />
  );
});
