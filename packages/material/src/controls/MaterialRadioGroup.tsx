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
import React from 'react';
import {
  ControlProps,
  showAsRequired,
  isDescriptionHidden,
  OwnPropsOfEnum
} from '@jsonforms/core';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Hidden,
  Radio,
  RadioGroup
} from '@mui/material';
import { useFocus } from '../util';

export const MaterialRadioGroup = (props: ControlProps & OwnPropsOfEnum) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    config,
    id,
    label,
    required,
    description,
    errors,
    data,
    visible,
    options,
    handleChange,
    path
  } = props;
  const isValid = errors.length === 0;
  const appliedUiSchemaOptions = merge(
    {},
    config,
    props.uischema.options
  );
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );
  const onChange = (_ev:any, value:any) => handleChange(path, value);

  return (
    <Hidden xsUp={!visible}>
      <FormControl
        component={'fieldset' as 'div'}
        fullWidth={!appliedUiSchemaOptions.trim}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <FormLabel
          htmlFor={id}
          error={!isValid}
          component={'legend' as 'label'}
          required={showAsRequired(required,
            appliedUiSchemaOptions.hideRequiredAsterisk)}
        >
          {label}
        </FormLabel>

        <RadioGroup
          value={props.data}
          onChange={onChange}
          row={true}
        >
          {options.map(option => (
            <FormControlLabel
              value={option.value}
              key={option.label}
              control={<Radio checked={data === option.value} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <FormHelperText error={!isValid}>
          {!isValid ? errors : showDescription ? description : null}
        </FormHelperText>
      </FormControl>
    </Hidden>
  );
};
