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
} from '@jsonforms/core';
import {
  IconButton,
  TableRow,
  Tooltip
} from '@mui/material';
import { Grid, Hidden, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ValidationIcon from './ValidationIcon';
import NoBorderTableCell from './NoBorderTableCell';

export interface MaterialTableToolbarProps {
  numColumns: number;
  errors: string;
  label: string;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  rootSchema: JsonSchema;
  enabled: boolean;
  addItem(path: string, value: any): () => void;
}

const fixedCellSmall = {
  paddingLeft: 0,
  paddingRight: 0,
}

const TableToolbar = React.memo(
  ({
    numColumns,
    errors,
    label,
    path,
    addItem,
    schema,
    enabled
  }: MaterialTableToolbarProps) => (
    <TableRow>
      <NoBorderTableCell colSpan={numColumns}>
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
            <Hidden smUp={errors.length === 0}>
              <Grid item>
                <ValidationIcon
                  id='tooltip-validation'
                  errorMessages={errors}
                />
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </NoBorderTableCell>
      {enabled ? (
        <NoBorderTableCell align='right' style={ fixedCellSmall }>
          <Tooltip
            id='tooltip-add'
            title={`Add to ${label}`}
            placement='bottom'
          >
            <IconButton
              aria-label={`Add to ${label}`}
              onClick={addItem(path, createDefaultValue(schema))}
              size='large'>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </NoBorderTableCell>
      ) : null}
    </TableRow>
  )
);

export default TableToolbar;
