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
import React, { useCallback } from 'react';
import {
  ControlProps,
  showAsRequired,
  isDescriptionHidden,
  isRangeControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Hidden,
  Slider,
  Typography,
} from '@mui/material';
import merge from 'lodash/merge';
import { useFocus } from '../util';

export const MaterialSliderControl = (props: ControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    data,
    description,
    enabled,
    errors,
    label,
    schema,
    handleChange,
    visible,
    path,
    required,
    config,
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge({}, config, props.uischema.options);
  const labelStyle: { [x: string]: any } = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  };
  const rangeContainerStyle: { [x: string]: any } = {
    display: 'flex',
  };
  const rangeItemStyle: { [x: string]: any } = {
    flexGrow: '1',
  };
  const sliderStyle: { [x: string]: any } = {
    marginTop: '7px',
  };

  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const onChange = useCallback(
    (_ev: any, value: any) => handleChange(path, Number(value)),
    [path, handleChange]
  );

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
      >
        <FormLabel
          htmlFor={id}
          error={!isValid}
          component={'legend' as 'label'}
          required={showAsRequired(
            required,
            appliedUiSchemaOptions.hideRequiredAsterisk
          )}
        >
          <Typography id={id + '-typo'} style={labelStyle} variant='caption'>
            {label}
          </Typography>
        </FormLabel>
        <div style={rangeContainerStyle}>
          <Typography style={rangeItemStyle} variant='caption' align='left'>
            {schema.minimum}
          </Typography>
          <Typography style={rangeItemStyle} variant='caption' align='right'>
            {schema.maximum}
          </Typography>
        </div>
        <Slider
          style={sliderStyle}
          min={schema.minimum}
          max={schema.maximum}
          value={Number(data || schema.default)}
          onChange={onChange}
          id={id + '-input'}
          disabled={!enabled}
          step={schema.multipleOf || 1}
        />
        <FormHelperText error={!isValid}>
          {!isValid ? errors : showDescription ? description : null}
        </FormHelperText>
      </FormControl>
    </Hidden>
  );
};
export const materialSliderControlTester: RankedTester = rankWith(
  4,
  isRangeControl
);

export default withJsonFormsControlProps(MaterialSliderControl);
