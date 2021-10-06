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
import React, { useMemo } from 'react';
import {
  ControlProps,
  isDateControl,
  isDescriptionHidden,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormHelperText, Hidden } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import EventIcon from '@material-ui/icons/Event';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import { createOnChangeHandler, getData, useFocus } from '../util';

export const MaterialDateControl = (props: ControlProps)=> {
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
    config
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const format = appliedUiSchemaOptions.dateFormat ?? 'YYYY-MM-DD';
  const saveFormat = appliedUiSchemaOptions.dateSaveFormat ?? 'YYYY-MM-DD';

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
      <MuiPickersUtilsProvider utils={DayJsUtils}>
        <KeyboardDatePicker
          id={id + '-input'}
          required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
          label={label}
          error={!isValid}
          fullWidth={!appliedUiSchemaOptions.trim}
          InputLabelProps={data ? { shrink: true } : undefined}
          value={getData(data, saveFormat)}
          clearable
          onChange={onChange}
          format={format}
          views={appliedUiSchemaOptions.views}
          disabled={!enabled}
          autoFocus={appliedUiSchemaOptions.focus}
          onFocus={onFocus}
          onBlur={onBlur}
          cancelLabel={appliedUiSchemaOptions.cancelLabel}
          clearLabel={appliedUiSchemaOptions.clearLabel}
          okLabel={appliedUiSchemaOptions.okLabel}
          leftArrowIcon={<KeyboardArrowLeftIcon />}
          rightArrowIcon={<KeyboardArrowRightIcon />}
          keyboardIcon={<EventIcon />}
          invalidDateMessage={null}
          maxDateMessage={null}
          minDateMessage={null}
        />
        <FormHelperText error={!isValid && !showDescription}>
          {firstFormHelperText}
        </FormHelperText>
        <FormHelperText error={!isValid}>
          {secondFormHelperText}
        </FormHelperText>
      </MuiPickersUtilsProvider>
    </Hidden>
  );
};

export const materialDateControlTester: RankedTester = rankWith(
  4,
  isDateControl
);

export default withJsonFormsControlProps(MaterialDateControl);
