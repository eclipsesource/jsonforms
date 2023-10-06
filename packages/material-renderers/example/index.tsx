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
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextFieldProps,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { renderExample } from '../../examples-react/src/index';
import { materialRenderers, materialCells } from '../src';

const MuiWrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  const [variant, setVariant] =
    React.useState<TextFieldProps['variant']>('standard');

  const handleVariantChange = (event: SelectChangeEvent<unknown>) => {
    setVariant(event.target.value as TextFieldProps['variant']);
  };

  const theme = React.useMemo(() => {
    return createTheme({
      components: {
        MuiTextField: {
          defaultProps: {
            variant,
          },
        },
        MuiSelect: {
          defaultProps: {
            variant,
          },
        },
        // avoid jammed look of input fields when variant is not 'standard'
        ...(variant !== 'standard'
          ? {
              MuiFormControl: {
                styleOverrides: {
                  root: {
                    marginTop: '8px',
                  },
                },
              },
            }
          : {}),
      },
    });
  }, [variant]);

  const label = 'TextField variant';

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2}>
        <FormControl sx={{ width: 200 }} variant='outlined'>
          <InputLabel>{label}</InputLabel>
          <Select value={variant} label={label} onChange={handleVariantChange}>
            <MenuItem value='standard'>Standard</MenuItem>
            <MenuItem value='outlined'>Outlined</MenuItem>
            <MenuItem value='filled'>Filled</MenuItem>
          </Select>
        </FormControl>
        <Divider />
        {children}
      </Stack>
    </ThemeProvider>
  );
};

renderExample(materialRenderers, materialCells, MuiWrapper);
