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
import {
  Theme,
  FilledInput,
  Input,
  OutlinedInput,
  TextFieldProps,
  useThemeProps,
  InputBaseProps,
} from '@mui/material';

export interface JsonFormsTheme extends Theme {
  jsonforms?: {
    input?: {
      delete?: {
        background?: string;
      };
    };
  };
}

export interface WithInputProps {
  label?: string;
}

export interface WithSelectProps {
  multiple?: boolean;
}

const variantToInput = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};

export const defaultInputVariant: TextFieldProps['variant'] = 'outlined';

export function useInputVariant(): TextFieldProps['variant'] {
  const { variant = defaultInputVariant } = useThemeProps({
    props: {} as TextFieldProps,
    name: 'MuiTextField',
  });
  return variant;
}

export function useInputComponent(): React.JSXElementConstructor<
  InputBaseProps & WithInputProps
> {
  const variant = useInputVariant();
  return variantToInput[variant] ?? variantToInput[defaultInputVariant];
}
