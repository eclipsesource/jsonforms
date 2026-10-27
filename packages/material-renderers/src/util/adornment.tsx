/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
import React, { ReactNode } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { SxProps, Theme } from '@mui/material/styles';
import { useInputVariant } from './theme';

export interface AdornmentOptions {
  startAdornment?: unknown;
  endAdornment?: unknown;
}

export interface InputAdornmentProps {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  notched?: boolean;
}

export interface InputAdornmentSx {
  startAdornmentSx?: SxProps<Theme>;
  endAdornmentSx?: SxProps<Theme>;
}

export const isAdornmentText = (value: unknown): value is string =>
  typeof value === 'string' && value !== '';

/**
 * Creates the start and end adornments configured via the `startAdornment`
 * and `endAdornment` UI schema options.
 *
 * Renderers place the label outside of the input, so MUI cannot detect a
 * start adornment on its own. The outlined variant therefore needs an
 * explicit `notched` to leave room for the shrunk label.
 */
export const useInputAdornments = (
  options: AdornmentOptions,
  { startAdornmentSx, endAdornmentSx }: InputAdornmentSx = {}
): InputAdornmentProps => {
  const variant = useInputVariant();
  const { startAdornment, endAdornment } = options;
  const adornmentProps: InputAdornmentProps = {};
  if (isAdornmentText(startAdornment)) {
    adornmentProps.startAdornment = (
      <InputAdornment position='start' sx={startAdornmentSx}>
        {startAdornment}
      </InputAdornment>
    );
    if (variant === 'outlined') {
      adornmentProps.notched = true;
    }
  }
  if (isAdornmentText(endAdornment)) {
    adornmentProps.endAdornment = (
      <InputAdornment position='end' sx={endAdornmentSx}>
        {endAdornment}
      </InputAdornment>
    );
  }
  return adornmentProps;
};
