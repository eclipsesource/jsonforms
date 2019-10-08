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
import {
  computeLabel,
  ControlProps,
  ControlState,
  isDateControl,
  isDescriptionHidden,
  isPlainLabel,
  isTimeControl,
  or,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { Hidden } from '@material-ui/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import TextField from '@material-ui/core/TextField';
import merge from 'lodash/merge';

export class MaterialNativeControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      errors,
      label,
      schema,
      description,
      enabled,
      visible,
      required,
      path,
      handleChange,
      data,
      config
    } = this.props;
    const isValid = errors.length === 0;
    const appliedUiSchemaOptions = merge(
      {},
      config,
      this.props.uischema.options
    );
    const onChange = (ev: any) => handleChange(path, ev.target.value);
    const fieldType = schema.format;
    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused,
      appliedUiSchemaOptions.showUnfocusedDescription
    );

    return (
      <Hidden xsUp={!visible}>
        <TextField
          id={id + '-input'}
          label={computeLabel(
            isPlainLabel(label) ? label : label.default,
            required,
            appliedUiSchemaOptions.hideRequiredAsterisk
          )}
          type={fieldType}
          error={!isValid}
          disabled={!enabled}
          fullWidth={!appliedUiSchemaOptions.trim}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          helperText={!isValid ? errors : showDescription ? description : null}
          InputLabelProps={{ shrink: true }}
          value={data}
          onChange={onChange}
        />
      </Hidden>
    );
  }
}

export const materialNativeControlTester: RankedTester = rankWith(
  2,
  or(isDateControl, isTimeControl)
);

export default withJsonFormsControlProps(MaterialNativeControl);
