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
import merge from 'lodash/merge';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ControlProps,
  defaultDateFormat,
  isDateControl,
  isDescriptionHidden,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormHelperText } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  createOnBlurHandler,
  createOnChangeHandler,
  getData,
  useFocus,
} from '../util';

export const MaterialDateControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    description,
    id,
    errors,
    label,
    uischema,
    visible,
    enabled,
    required,
    path,
    handleChange,
    data,
    config,
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const [key, setKey] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const format = appliedUiSchemaOptions.dateFormat ?? 'YYYY-MM-DD';
  const saveFormat = appliedUiSchemaOptions.dateSaveFormat ?? defaultDateFormat;

  const views = appliedUiSchemaOptions.views ?? ['year', 'day'];

  const firstFormHelperText = showDescription
    ? description
    : !isValid
    ? errors
    : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;

  const updateChild = useCallback(() => setKey((key) => key + 1), []);

  const onChange = useMemo(
    () => createOnChangeHandler(path, handleChange, saveFormat),
    [path, handleChange, saveFormat]
  );

  const onBlurHandler = useMemo(
    () =>
      createOnBlurHandler(
        path,
        handleChange,
        format,
        saveFormat,
        updateChild,
        onBlur
      ),
    [path, handleChange, format, saveFormat, updateChild]
  );
  const value = getData(data, saveFormat);

  if (!visible) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        key={key}
        label={label}
        value={value}
        onAccept={onChange}
        format={format}
        views={views}
        disabled={!enabled}
        slotProps={{
          actionBar: ({ wrapperVariant }) => ({
            actions:
              wrapperVariant === 'desktop' ? [] : ['clear', 'cancel', 'accept'],
          }),
          textField: {
            id: id + '-input',
            required: required && !appliedUiSchemaOptions.hideRequiredAsterisk,
            autoFocus: appliedUiSchemaOptions.focus,
            error: !isValid,
            fullWidth: !appliedUiSchemaOptions.trim,
            inputProps: {
              type: 'text',
            },
            InputLabelProps: data ? { shrink: true } : undefined,
            onFocus: onFocus,
            onBlur: onBlurHandler,
          },
        }}
      />
      <FormHelperText error={!isValid && !showDescription}>
        {firstFormHelperText}
      </FormHelperText>
      <FormHelperText error={!isValid}>{secondFormHelperText}</FormHelperText>
    </LocalizationProvider>
  );
};

export const materialDateControlTester: RankedTester = rankWith(
  4,
  isDateControl
);

export default withJsonFormsControlProps(MaterialDateControl);
