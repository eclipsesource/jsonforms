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
  ControlElement,
  createDefaultValue,
  JsonSchema,
  ArrayTranslations,
} from '@jsonforms/core';
import {
  IconButton,
  TableRow,
  Tooltip,
  Grid,
  Typography,
  FormHelperText,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ValidationIcon from './ValidationIcon';
import NoBorderTableCell from './NoBorderTableCell';

export interface MaterialTableToolbarProps {
  numColumns: number;
  errors: string;
  label: string;
  description: string;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  enabled: boolean;
  translations: ArrayTranslations;
  addItem(path: string, value: any): () => void;
  disableAdd?: boolean;
}

const fixedCellSmall = {
  paddingLeft: 0,
  paddingRight: 0,
};

const TableToolbar = React.memo(function TableToolbar({
  numColumns,
  errors,
  label,
  description,
  path,
  addItem,
  schema,
  enabled,
  translations,
  rootSchema,
  disableAdd,
}: MaterialTableToolbarProps) {
  return (
    <TableRow>
      <NoBorderTableCell colSpan={numColumns}>
        <Stack>
          <Grid
            container
            justifyContent={'flex-start'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item>
              <Typography variant={'h6'}>{label}</Typography>
            </Grid>
            <Grid item>
              {errors.length !== 0 && (
                <Grid item>
                  <ValidationIcon
                    id='tooltip-validation'
                    errorMessages={errors}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {description && <FormHelperText>{description}</FormHelperText>}
        </Stack>
      </NoBorderTableCell>
      {enabled && !disableAdd ? (
        <NoBorderTableCell align='right' style={fixedCellSmall}>
          <Tooltip
            id='tooltip-add'
            title={translations.addTooltip}
            placement='bottom'
          >
            <IconButton
              aria-label={translations.addAriaLabel}
              onClick={addItem(path, createDefaultValue(schema, rootSchema))}
              size='large'
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </NoBorderTableCell>
      ) : null}
    </TableRow>
  );
});

export default TableToolbar;
