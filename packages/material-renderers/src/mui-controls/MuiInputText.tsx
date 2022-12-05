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
import React, { useState } from 'react';
import { CellProps, WithClassname } from '@jsonforms/core';
import {
  IconButton,
  Input,
  InputAdornment,
  InputBaseComponentProps,
  InputProps,
  useTheme
} from '@mui/material';
import merge from 'lodash/merge';
import Close from '@mui/icons-material/Close';
import { JsonFormsTheme, useDebouncedChange } from '../util';

interface MuiTextInputProps {
  muiInputProps?: InputProps['inputProps'];
  inputComponent?: InputProps['inputComponent'];
}

const eventToValue = (ev:any) => ev.target.value === '' ? undefined : ev.target.value;

export const MuiInputText = React.memo((props: CellProps & WithClassname & MuiTextInputProps) => { 
  const [showAdornment, setShowAdornment] = useState(false);
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
    muiInputProps,
    inputComponent
  } = props;
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  let inputProps: InputBaseComponentProps;
  if (appliedUiSchemaOptions.restrict) {
    inputProps = { maxLength: maxLength };
  } else {
    inputProps = {};
  }
  
  inputProps = merge(inputProps, muiInputProps);
  
  if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
    inputProps.size = maxLength;
  };
  
  const [inputText, onChange, onClear] = useDebouncedChange(handleChange, '', data, path, eventToValue);
  const onPointerEnter = () => setShowAdornment(true);
  const onPointerLeave = () => setShowAdornment(false);

  const theme: JsonFormsTheme = useTheme();
  
  const closeStyle = {
    background: theme.jsonforms?.input?.delete?.background || theme.palette.background.default,
    borderRadius: '50%'
  };

  return (
    <Input
      type={
        appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'
      }
      value={inputText}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      multiline={appliedUiSchemaOptions.multi}
      fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
      inputProps={inputProps}
      error={!isValid}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      endAdornment={
        <InputAdornment
          position='end'
          style={{
            display:
              !showAdornment || !enabled || data === undefined ? 'none' : 'flex',
            position: 'absolute',
            right: 0
          }}
        >
          <IconButton
            aria-label='Clear input field'
            onClick={onClear}   
            size='large'
          >
            <Close style={closeStyle}/>
          </IconButton>
        </InputAdornment>
      }
      inputComponent={inputComponent}
    />
  );
});
