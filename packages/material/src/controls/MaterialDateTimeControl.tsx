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
import { FormHelperText, Hidden } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
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
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <KeyboardDateTimePicker
          id={id + '-input'}
          required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
          label={label}
          error={!isValid}
          fullWidth={!appliedUiSchemaOptions.trim}
          onFocus={onFocus}
          onBlur={onBlur}
          InputLabelProps={data ? { shrink: true } : undefined}
          value={getData(data, saveFormat)}
          clearable
          onChange={onChange}
          format={format}
          ampm={!!appliedUiSchemaOptions.ampm}
          views={appliedUiSchemaOptions.views}
          disabled={!enabled}
          autoFocus={appliedUiSchemaOptions.focus}
          cancelLabel={appliedUiSchemaOptions.cancelLabel}
          clearLabel={appliedUiSchemaOptions.clearLabel}
          okLabel={appliedUiSchemaOptions.okLabel}
          leftArrowIcon={<KeyboardArrowLeftIcon />}
          rightArrowIcon={<KeyboardArrowRightIcon />}
          dateRangeIcon={<DateRangeIcon />}
          keyboardIcon={<EventIcon />}
          timeIcon={<AccessTimeIcon />}
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

export const materialDateTimeControlTester: RankedTester = rankWith(
  2,
  isDateTimeControl
);

export default withJsonFormsControlProps(MaterialDateTimeControl);
