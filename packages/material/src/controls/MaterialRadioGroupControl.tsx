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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { FormControl, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core';

export class MaterialRadioGroupControl extends Control<ControlProps, ControlState> {
    render() {
        const {
            config,
            id,
            label,
            required,
            description,
            errors,
            data,
            schema,
            visible
        } = this.props;
        const isValid = errors.length === 0;
        const style: { [x: string]: any } = {};
        if (!visible) {
            style.display = 'none';
        }
        const trim = config.trim;
        const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused);

        const options = schema.enum;

        return (
            <FormControl
                component={'fieldset' as 'div'}
                fullWidth={!trim}
            >
                <FormLabel
                    htmlFor={id}
                    error={!isValid}
                    component={'legend' as 'label'}
                >
                    {computeLabel(isPlainLabel(label) ? label : label.default, required)}
                </FormLabel>

                <RadioGroup
                    value={this.state.value}
                    onChange={(_ev, value) => this.handleChange(value)}
                    row={true}
                >
                    {
                        options.map(optionValue =>
                            (
                                <FormControlLabel
                                    value={optionValue}
                                    key={optionValue}
                                    control={<Radio checked={data === optionValue} />}
                                    label={optionValue}
                                />
                            )
                        )
                    }
                </RadioGroup>
                <FormHelperText error={!isValid}>
                    {!isValid ? formatErrorMessage(errors) : showDescription ? description : null}
                </FormHelperText>
            </FormControl>
        );
    }
}

export default connect(mapStateToControlProps, mapDispatchToControlProps)(MaterialRadioGroupControl);
