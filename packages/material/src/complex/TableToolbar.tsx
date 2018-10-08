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
import * as React from 'react';
import {
    ArrayControlProps,
    ControlElement,
    Helpers
} from '@jsonforms/core';
import Button from '@material-ui/core/Button';
import { Grid, Hidden } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ValidationIcon from './ValidationIcon';

interface TableToolbarProps extends ArrayControlProps {
    numSelected: number;
    openConfirmDeleteDialog(): void;
}

export const TableToolbar = (
  {
    errors,
    childErrors,
    label,
    uischema,
    numSelected,
    openConfirmDeleteDialog,
    addItem,
    path
  }: TableToolbarProps
) => {
  const controlElement = uischema as ControlElement;
  const labelObject = Helpers.createLabelDescriptionFrom(controlElement);
  const allErrors = [].concat(errors).concat(childErrors.map(e => e.message));

  return (
    <Toolbar>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <Typography variant='title'>{label}</Typography>
        </Grid>
        <Hidden smUp={allErrors.length === 0}>
          <Grid item>
            <ValidationIcon id='tooltip-validation' errorMessages={allErrors}/>
          </Grid>
        </Hidden>
        <Grid item>
          <Grid container>
            <Grid item>
              <Tooltip id='tooltip-add' title={`Add to ${labelObject.text}`} placement='bottom'>
                <Button
                  variant='fab'
                  color='primary'
                  aria-label={`Add to ${labelObject.text}`}
                  onClick={addItem(path)}
                >
                  <AddIcon/>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title='Delete'>
                <div>
                  <Button
                    variant='fab'
                    aria-label={`Delete`}
                    disabled={numSelected === 0}
                    onClick={openConfirmDeleteDialog}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
