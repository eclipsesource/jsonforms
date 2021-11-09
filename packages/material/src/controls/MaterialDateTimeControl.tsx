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
import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import {
  ControlProps,
  isDateTimeControl,
  isDescriptionHidden,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormHelperText, Hidden, TextField } from '@mui/material';
import {
  DateTimePicker,
  LocalizationProvider 
} from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import { createOnChangeHandler, getData, useFocus } from '../util';

export const MaterialDateTimeControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    enabled,
    required,
    path,
    handleChange,
    data,
    config
  } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const isValid = errors.length === 0;

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const format = appliedUiSchemaOptions.dateTimeFormat ?? 'YYYY-MM-DD HH:mm';
  const saveFormat = appliedUiSchemaOptions.dateTimeSaveFormat ?? undefined;

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const onChange = useMemo(() => createOnChangeHandler(
    path,
    handleChange,
    saveFormat
  ),[path, handleChange, saveFormat]);

  return (
    <Hidden xsUp={!visible}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={label}
          value={getData(data, saveFormat)}
          clearable
          onChange={onChange}
          inputFormat={format}
          disableMaskedInput
          ampm={!!appliedUiSchemaOptions.ampm}
          views={appliedUiSchemaOptions.views}
          disabled={!enabled}
          cancelText={appliedUiSchemaOptions.cancelLabel}
          clearText={appliedUiSchemaOptions.clearLabel}
          okText={appliedUiSchemaOptions.okLabel}
          renderInput={params => (
            <TextField 
              {...params}
              id={id + '-input'}
              required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
              autoFocus={appliedUiSchemaOptions.focus}
              error={!isValid}
              fullWidth={!appliedUiSchemaOptions.trim}
              inputProps={{ ...params.inputProps, type: 'text' }}
              InputLabelProps={data ? { shrink: true } : undefined}
              onFocus={onFocus}
              onBlur={onBlur}
              variant={'standard'}
            />
          )}
        />
        <FormHelperText error={!isValid && !showDescription}>
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText error={!isValid}>
          {secondFormHelperText}
        </FormHelperText>
      </LocalizationProvider>
    </Hidden>
  );
};

export const materialDateTimeControlTester: RankedTester = rankWith(
  2,
  isDateTimeControl
);

export default withJsonFormsControlProps(MaterialDateTimeControl);
