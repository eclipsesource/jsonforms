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
  ControlState,
  formatErrorMessage,
  isControl,
  isDescriptionHidden,
  isPlainLabel,
  mapStateToControlProps,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { connectToJsonForms, Control, DispatchField } from '@jsonforms/react';
import { VanillaControlProps } from '../index';
import { addVanillaControlProps } from '../util';

export class InputControl extends Control<VanillaControlProps, ControlState> {
  render() {
    const {
      classNames,
      description,
      id,
      errors,
      label,
      uischema,
      schema,
      visible,
      required,
      parentPath
    } = this.props;

    const isValid = errors.length === 0;
    const divClassNames = `validation  ${isValid ? classNames.description : 'validation_error'}`;
    const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);
    const labelText = isPlainLabel(label) ? label : label.default;

    return (
      <div
        className={classNames.wrapper}
        hidden={!visible}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <label htmlFor={id} className={classNames.label}>
          {computeLabel(labelText, required)}
        </label>
      <DispatchField uischema={uischema} schema={schema} path={parentPath}/>
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
        </div>
      </div>
    );
  }
}

export const inputControlTester: RankedTester = rankWith(1, isControl);

export const ConnectedInputControl = connectToJsonForms(
  addVanillaControlProps(mapStateToControlProps)
)(InputControl);

export default ConnectedInputControl;
