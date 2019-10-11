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
import { CellProps, WithClassname } from '@jsonforms/core';
import Input from '@material-ui/core/Input';
import merge from 'lodash/merge';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';

interface MuiInputTextStatus {
  showAdornment: boolean;
}

interface MuiTextInputProps {
  muiInputProps?: React.HTMLAttributes<HTMLInputElement>;
}

export class MuiInputText extends React.PureComponent<
  CellProps & WithClassname & MuiTextInputProps,
  MuiInputTextStatus
> {
  state: MuiInputTextStatus = { showAdornment: false };
  render() {
    const {
      data,
      config,
      className,
      id,
      enabled,
      uischema,
      isValid,
      path,
      handleChange,
      schema,
      muiInputProps
    } = this.props;
    const maxLength = schema.maxLength;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    let inputProps: any;
    if (appliedUiSchemaOptions.restrict) {
      inputProps = { maxLength: maxLength };
    } else {
      inputProps = {};
    }

    inputProps = merge(inputProps, muiInputProps);

    if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
      inputProps.size = maxLength;
    }
    const onChange = (ev: any) => handleChange(path, ev.target.value);

    return (
      <Input
        type={
          appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'
        }
        value={data || ''}
        onChange={onChange}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        multiline={appliedUiSchemaOptions.multi}
        fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
        inputProps={inputProps}
        error={!isValid}
        onPointerEnter={() => this.setState({ showAdornment: true })}
        onPointerLeave={() => this.setState({ showAdornment: false })}
        endAdornment={
          // Use visibility instead of 'Hidden' so the layout doesn't change when the icon is shown
          <InputAdornment
            position='end'
            style={{
              visibility:
                !this.state.showAdornment || !enabled ? 'hidden' : 'visible'
            }}
          >
            <IconButton
              aria-label='Clear input field'
              onClick={() => handleChange(path, undefined)}
            >
              <Close />
            </IconButton>
          </InputAdornment>
        }
      />
    );
  }
}
