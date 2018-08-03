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
import {
  computeLabel,
  ControlProps,
  ControlState,
  formatErrorMessage,
  isDescriptionHidden,
  isPlainLabel,
  isRangeControl,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { connectToJsonForms, Control } from '@jsonforms/react';

import { FormControl, FormHelperText, Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

export class MaterialSliderControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      data,
      description,
      enabled,
      errors,
      label,
      scopedSchema,
      handleChange,
      visible,
      path,
      required,
      config
    } = this.props;
    const isValid = errors.length === 0;
    const trim = config.trim;
    const style: { [x: string]: any } = {};
    if (!visible) {
      style.display = 'none';
    }
    const labelStyle: { [x: string]: any } = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%'
    };
    const rangeContainerStyle: { [x: string]: any } = {
      display: 'flex'
    };
    const rangeItemStyle: { [x: string]: any } = {
      flexGrow: '1'
    };
    const sliderStyle: { [x: string]: any } = {
      marginTop: '7px'
    };

    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);
    return (

      <FormControl
        style={style}
        fullWidth={!trim}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        id={id}
      >
        <Typography id={id + '-typo'} style={labelStyle} variant='caption'>
          {computeLabel(isPlainLabel(label) ? label : label.default, required)}
        </Typography>
        <div style={rangeContainerStyle}>
          <Typography style={rangeItemStyle} variant='caption' align='left'>
            {scopedSchema.minimum}
          </Typography>
          <Typography style={rangeItemStyle} variant='caption' align='right'>
            {scopedSchema.maximum}
          </Typography>
        </div>
        <Slider
          style={sliderStyle}
          min={scopedSchema.minimum}
          max={scopedSchema.maximum}
          value={Number(data || scopedSchema.default)}
          onChange={(_ev, value) => {
            handleChange(path, Number(value));
          }
          }
          id={id + '-input'}
          disabled={!enabled}
          step={scopedSchema.multipleOf || 1}
        />
        <FormHelperText error={!isValid}>
          {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
        </FormHelperText>
      </FormControl>
    );
  }
}
export const materialSliderControlTester: RankedTester = rankWith(4, isRangeControl);
export default connectToJsonForms(mapStateToControlProps)(MaterialSliderControl);
