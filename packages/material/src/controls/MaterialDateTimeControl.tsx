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
  computeLabel,
  ControlProps,
  ControlState,
  isDateTimeControl,
  isPlainLabel,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import moment from 'moment';
import { Hidden } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Workaround typing problems in @material-ui/pickers@3.2.3
const AnyPropsKeyboardDateTimepicker: React.FunctionComponent<
  any
> = KeyboardDateTimePicker;

export class MaterialDateTimeControl extends Control<
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
    const inputProps = {};

    return (
      <Hidden xsUp={!visible}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <AnyPropsKeyboardDateTimepicker
            id={id + '-input'}
            label={computeLabel(
              isPlainLabel(label) ? label : label.default,
              required,
              appliedUiSchemaOptions.hideRequiredAsterisk
            )}
            error={!isValid}
            fullWidth={!appliedUiSchemaOptions.trim}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            helperText={!isValid ? errors : description}
            InputLabelProps={{ shrink: true }}
            value={data || null}
            onChange={(datetime: any) =>
              handleChange(path, datetime ? moment(datetime).format() : '')
            }
            format='MM/DD/YYYY h:mm a'
            clearable={true}
            disabled={!enabled}
            autoFocus={appliedUiSchemaOptions.focus}
            leftArrowIcon={<KeyboardArrowLeftIcon />}
            rightArrowIcon={<KeyboardArrowRightIcon />}
            dateRangeIcon={<DateRangeIcon />}
            keyboardIcon={<EventIcon />}
            timeIcon={<AccessTimeIcon />}
            InputProps={inputProps}
          />
        </MuiPickersUtilsProvider>
      </Hidden>
    );
  }
}

export const materialDateTimeControlTester: RankedTester = rankWith(
  2,
  isDateTimeControl
);

export default withJsonFormsControlProps(MaterialDateTimeControl);
