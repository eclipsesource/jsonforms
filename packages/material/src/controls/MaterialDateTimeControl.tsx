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
import { connect } from 'react-redux';
import {
  computeLabel,
  ControlProps,
  ControlState,
  isDateTimeControl,
  isPlainLabel,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { Control } from '@jsonforms/react';
import moment from 'moment';
import { Hidden } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

export class MaterialDateTimeControl extends Control<ControlProps, ControlState> {
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
    const isValid = errors.length === 0;
    const trim = config.trim;

    const getValue = (event: React.FormEvent<HTMLInputElement>) =>
      (event.target as HTMLInputElement).value;
    const inputProps = {};

    return (
      <Hidden xsUp={!visible}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            keyboard
            id={id + '-input'}
            label={computeLabel(isPlainLabel(label) ? label : label.default, required)}
            error={!isValid}
            fullWidth={!trim}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            helperText={!isValid ? errors : description}
            InputLabelProps={{ shrink: true, }}
            value={data || null}
            onChange={datetime => handleChange(path, datetime ? moment(datetime).format() : '')}
            onInputChange={ev =>
              handleChange(path, getValue(ev) ? moment(getValue(ev)).format() : '')}
            format='MM/DD/YYYY h:mm a'
            clearable={true}
            disabled={!enabled}
            autoFocus={uischema.options && uischema.options.focus}
            leftArrowIcon={<KeyboardArrowLeftIcon />}
            rightArrowIcon={<KeyboardArrowRightIcon />}
            dateRangeIcon={<DateRangeIcon />}
            keyboardIcon={<EventIcon />}
            timeIcon={<AccessTimeIcon />}
            onClear={() => handleChange(path, '')}
            InputProps={inputProps}
          />
        </MuiPickersUtilsProvider>
      </Hidden>
    );
  }
}
export const materialDateTimeControlTester: RankedTester = rankWith(2, isDateTimeControl);
export default connect(
  mapStateToControlProps, mapDispatchToControlProps
)(MaterialDateTimeControl);
