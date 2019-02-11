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
  formatErrorMessage,
  isDescriptionHidden,
  isPlainLabel,
  mapDispatchToControlProps,
  mapStateToControlProps
} from '@jsonforms/core';
import { Control } from '@jsonforms/react';
import { addVanillaControlProps } from '../util';
import { VanillaRendererProps } from '../index';

export class RadioGroupControl extends Control<ControlProps & VanillaRendererProps, ControlState> {

    render() {
        const {
            classNames,
            id,
            label,
            required,
            description,
            errors,
            data,
            schema,
            visible,
        } = this.props;
        const isValid = errors.length === 0;
        const divClassNames =
            `validation  ${isValid ? classNames.description : 'validation_error'}`;
        const groupStyle: { [x: string]: any } = {
            display: 'flex',
            flexDirection: 'row'
        };
        const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);

        const options = schema.enum;

        return (
            <div
                className={classNames.wrapper}
                hidden={!visible}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            >
                <label htmlFor={id} className={classNames.label} >
                    {computeLabel(isPlainLabel(label) ? label : label.default, required)}
                </label>

                <div
                    style={groupStyle}
                >
                    {
                        options.map(optionValue =>
                            (
                                <div key={optionValue}>
                                    <input
                                        type='radio'
                                        value={optionValue}
                                        id={optionValue}
                                        name={id}
                                        checked={data === optionValue}
                                        onChange={ev =>
                                            this.handleChange(ev.currentTarget.value)
                                        }
                                    />
                                    <label htmlFor={optionValue}>{optionValue}</label>
                                </div>
                            )
                        )
                    }
                </div>
                <div className={divClassNames}>
                    {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
                </div>
            </div>
        );
    }
}

export default connect(
    addVanillaControlProps(mapStateToControlProps), mapDispatchToControlProps
)(RadioGroupControl);
