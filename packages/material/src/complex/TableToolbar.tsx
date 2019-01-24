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
import { LabelDescription, Labels } from '@jsonforms/core';
import IconButton from '@material-ui/core/IconButton';
import { Grid, Hidden } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ValidationIcon from './ValidationIcon';
import NoBorderTableCell from './NoBorderTableCell';

export interface MaterialTableToolbarProps {
    numColumns: number;
    errors: string[];
    label: string | Labels;
    labelObject: LabelDescription;
    path: string;
    addItem(path: string): () => void;
}

const TableToolbar = (
    { numColumns, errors, label, labelObject, path, addItem }: MaterialTableToolbarProps
) => (
    <TableRow>
        <NoBorderTableCell colSpan={numColumns}>
            <Grid
                container
                justify={'flex-start'}
                alignItems={'center'}
                spacing={16}
            >
                <Grid item>
                  <Typography variant={'headline'}>{label}</Typography>
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
        <NoBorderTableCell>
            <Tooltip
                id='tooltip-add'
                title={`Add to ${labelObject.text}`}
                placement='bottom'
            >
                <IconButton
                    aria-label={`Add to ${labelObject.text}`}
                    onClick={addItem(path)}
                >
                    <AddIcon/>
                </IconButton>
            </Tooltip>
        </NoBorderTableCell>
    </TableRow>
);

export default TableToolbar;
