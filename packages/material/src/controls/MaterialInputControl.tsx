/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  isPlainLabel,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { Control, DispatchField } from '@jsonforms/react';

import { InputLabel } from '@material-ui/core';
import { FormControl, FormHelperText } from '@material-ui/core';

export class MaterialInputControl extends Control<ControlProps, ControlState> {
  render() {
    const {
      id,
      description,
      errors,
      label,
      uischema,
      schema,
      visible,
      required,
      path,
      config
    } = this.props;
    const isValid = errors.length === 0;
    const trim = config.trim;
    const style: { [x: string]: any } = {};
    if (!visible) {
      style.display = 'none';
    }
    const inputLabelStyle: { [x: string]: any } = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      // magic width as the label is transformed to 75% of its size
      width: '125%'
    };

    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused
    );
    return (
      <FormControl
        style={style}
        fullWidth={!trim}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        id={id}
      >
        <InputLabel
          htmlFor={id + '-input'}
          error={!isValid}
          style={inputLabelStyle}
        >
          {computeLabel(isPlainLabel(label) ? label : label.default, required)}
        </InputLabel>
        <DispatchField
          uischema={uischema}
          schema={schema}
          path={path}
          id={id + '-input'}
        />
        <FormHelperText error={!isValid}>
          {!isValid
            ? formatErrorMessage(errors)
            : showDescription
            ? description
            : null}
        </FormHelperText>
      </FormControl>
    );
  }
}
export const materialInputControlTester: RankedTester = rankWith(1, isControl);
export default connect(mapStateToControlProps)(MaterialInputControl);
