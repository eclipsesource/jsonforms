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
import * as React from 'react';
import * as _ from 'lodash';
import {
  computeLabel,
  ControlProps,
  ControlState,
  isDateControl,
  isDescriptionHidden,
  isPlainLabel,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  StatePropsOfControl
} from '@jsonforms/core';
import { connectToJsonForms, Control } from '@jsonforms/react';
import { DatePicker } from 'material-ui-pickers';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface DateControl {
  momentLocale?: Moment;
}

export class MaterialDateControl extends Control<ControlProps & DateControl, ControlState> {
  render() {
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
      momentLocale
    } = this.props;
    const isValid = errors.length === 0;
    const trim = uischema.options && uischema.options.trim;
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);
    let style = {};
    if (!visible) {
      style = {display: 'none'};
    }
    const inputProps = {};
    const localeDateTimeFormat =
      momentLocale ? `${momentLocale.localeData().longDateFormat('L')}`
      : 'YYYY-MM-DD';

    let labelText;
    let labelCancel;
    let labelClear;

    if (isPlainLabel(label)) {
      labelText = label;
      labelCancel = 'Cancel';
      labelClear = 'Clear';
    } else {
      labelText = label.default;
      labelCancel = _.startsWith(label.cancel, '%') ? 'Cancel' : label.cancel;
      labelClear = _.startsWith(label.clear, '%') ? 'Clear' : label.clear;
    }

    return (
      <DatePicker
        id={id}
        label={computeLabel(labelText, required)}
        error={!isValid}
        style={style}
        fullWidth={!trim}
        helperText={!isValid ? errors : showDescription ? description : null}
        InputLabelProps={{shrink: true}}
        value={data || null}
        onChange={ datetime =>
          handleChange(path, datetime ? moment(datetime).format('YYYY-MM-DD') : '')
        }
        format={localeDateTimeFormat}
        clearable={true}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        onClear={() => handleChange(path, '')}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        cancelLabel={labelCancel}
        clearLabel={labelClear}
        leftArrowIcon={<KeyboardArrowLeftIcon />}
        rightArrowIcon={<KeyboardArrowRightIcon />}
        InputProps={inputProps}
      />
    );
  }
}

export const addLabelProps = (mapStateToProps: (s, p) => any) =>
  (state, ownProps): StatePropsOfControl => {
    const stateProps = mapStateToProps(state, ownProps);

    return {
      ...stateProps,
      label: {
        default: stateProps.label,
        cancel: '%cancel',
        clear: '%clear'
      },
    };
  };

export const materialDateControlTester: RankedTester = rankWith(4, isDateControl);
export default connectToJsonForms(
  addLabelProps(mapStateToControlProps),
  mapDispatchToControlProps
)(MaterialDateControl);
