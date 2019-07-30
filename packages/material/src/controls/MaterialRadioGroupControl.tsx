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
  computeLabel,
  ControlProps,
  ControlState,
  isDescriptionHidden,
  isPlainLabel,
  rankWith,
  RankedTester,
  optionIs
} from '@jsonforms/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Hidden
} from '@material-ui/core';

export class MaterialRadioGroupControl extends Control<
  ControlProps,
  ControlState
> {
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
    const appliedUiSchemaOptions = merge(
      {},
      config,
      this.props.uischema.options
    );
    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused,
      appliedUiSchemaOptions.showUnfocusedDescription
    );

    const options = schema.enum;

    return (
      <Hidden xsUp={!visible}>
        <FormControl
          component={'fieldset' as 'div'}
          fullWidth={!appliedUiSchemaOptions.trim}
        >
          <FormLabel
            htmlFor={id}
            error={!isValid}
            component={'legend' as 'label'}
          >
            {computeLabel(
              isPlainLabel(label) ? label : label.default,
              required,
              appliedUiSchemaOptions.hideRequiredAsterisk
            )}
          </FormLabel>

          <RadioGroup
            value={this.state.value}
            onChange={(_ev, value) => this.handleChange(value)}
            row={true}
          >
            {options.map(optionValue => (
              <FormControlLabel
                value={optionValue}
                key={optionValue}
                control={<Radio checked={data === optionValue} />}
                label={optionValue}
              />
            ))}
          </RadioGroup>
          <FormHelperText error={!isValid}>
            {!isValid ? errors : showDescription ? description : null}
          </FormHelperText>
        </FormControl>
      </Hidden>
    );
  }
}

export const materialRadioGroupControlTester: RankedTester = rankWith(
  2,
  optionIs('format', 'radio')
);
export default withJsonFormsControlProps(MaterialRadioGroupControl);
