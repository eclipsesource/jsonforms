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
import { Hidden } from '@material-ui/core';

interface MuiInputTextStatus {
  showAdornment: boolean;
}

interface MuiTextInputProps {
  inputProps?: {
    autocomplete?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | object;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    size?: number;
    spellcheck?: boolean;
    autocorrect?: 'on' | 'off';
    mozactionhint?: 'go' | 'done' | 'next' | 'search' | 'send';
  };
}

export class MuiInputText extends React.Component<
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
      inputProps
    } = this.props;
    const maxLength = schema.maxLength;
    const mergedConfig = merge({}, config, uischema.options);
    let innerInputProps: any;
    if (mergedConfig.restrict) {
      innerInputProps = { maxLength: maxLength };
    } else {
      innerInputProps = {};
    }

    innerInputProps = merge(innerInputProps, inputProps);

    if (mergedConfig.trim && maxLength !== undefined) {
      innerInputProps.size = maxLength;
    }
    const onChange = (ev: any) => handleChange(path, ev.target.value);

    return (
      <Input
        type={
          uischema.options && uischema.options.format === 'password'
            ? 'password'
            : 'text'
        }
        value={data || ''}
        onChange={onChange}
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        multiline={uischema.options && uischema.options.multi}
        fullWidth={!mergedConfig.trim || maxLength === undefined}
        inputProps={innerInputProps}
        error={!isValid}
        onPointerEnter={() => this.setState({ showAdornment: true })}
        onPointerLeave={() => this.setState({ showAdornment: false })}
        endAdornment={
          <InputAdornment position='end'>
            <Hidden xsUp={!this.state.showAdornment}>
              <IconButton
                aria-label='Clear input field'
                onClick={() => handleChange(path, undefined)}
              >
                <Close />
              </IconButton>
            </Hidden>
          </InputAdornment>
        }
      />
    );
  }
}
