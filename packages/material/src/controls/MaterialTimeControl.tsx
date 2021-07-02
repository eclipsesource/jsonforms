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
import merge from 'lodash/merge';
import {
  ControlProps,
  ControlState,
  isTimeControl,
  isDescriptionHidden,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import { FormHelperText, Hidden } from '@material-ui/core';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import { createOnChangeHandler, getData } from '../util';

export class MaterialTimeControl extends Control<
  ControlProps,
  ControlState
> {
  render() {
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
    } = this.props;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const isValid = errors.length === 0;

    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused,
      appliedUiSchemaOptions.showUnfocusedDescription
    );

    const format = appliedUiSchemaOptions.timeFormat ?? 'HH:mm';
    const saveFormat = appliedUiSchemaOptions.timeSaveFormat ?? 'HH:mm:ss';

    const firstFormHelperText = showDescription
      ? description
      : !isValid
      ? errors
      : null;
    const secondFormHelperText = showDescription && !isValid ? errors : null;

    return (
      <Hidden xsUp={!visible}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <KeyboardTimePicker
            id={id + '-input'}
            required={required && !appliedUiSchemaOptions.hideRequiredAsterisk}
            label={label}
            error={!isValid}
            fullWidth={!appliedUiSchemaOptions.trim}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            InputLabelProps={data ? { shrink: true } : undefined}
            value={getData(data, saveFormat)}
            clearable
            onChange={createOnChangeHandler(
              path,
              handleChange,
              saveFormat
            )}
            format={format}
            ampm={!!appliedUiSchemaOptions.ampm}
            views={appliedUiSchemaOptions.views}
            disabled={!enabled}
            autoFocus={appliedUiSchemaOptions.focus}
            cancelLabel={appliedUiSchemaOptions.cancelLabel}
            clearLabel={appliedUiSchemaOptions.clearLabel}
            okLabel={appliedUiSchemaOptions.okLabel}
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
  }
}

export const materialTimeControlTester: RankedTester = rankWith(
  4,
  isTimeControl
);

export default withJsonFormsControlProps(MaterialTimeControl);
