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
import React from 'react';
import {
  ControlProps,
  showAsRequired,
  isDateControl,
  isDescriptionHidden,
  isTimeControl,
  or,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { Hidden, TextField } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import { useDebouncedChange, useFocus } from '../util';

export const MaterialNativeControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    errors,
    label,
    schema,
    description,
    enabled,
    visible,
    required,
    path,
    handleChange,
    data,
    config,
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, props.uischema.options);
  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    '',
    data,
    path
  );
  const fieldType = appliedUiSchemaOptions.format ?? schema.format;
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  return (
    <Hidden xsUp={!visible}>
      <TextField
        required={showAsRequired(
          required,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
        id={id + '-input'}
        label={label}
        type={fieldType}
        error={!isValid}
        disabled={!enabled}
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
        helperText={!isValid ? errors : showDescription ? description : null}
        InputLabelProps={{ shrink: true }}
        value={inputValue}
        onChange={onChange}
      />
    </Hidden>
  );
};

export const materialNativeControlTester: RankedTester = rankWith(
  2,
  or(isDateControl, isTimeControl)
);

export default withJsonFormsControlProps(MaterialNativeControl);
