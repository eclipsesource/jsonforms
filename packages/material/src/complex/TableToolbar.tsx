import * as React from 'react';
import {
  ControlElement,
  Helpers
} from '@jsonforms/core';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import { ValidationIcon } from './ValidationIcon';

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
  }
) => {
  const controlElement = uischema as ControlElement;
  const labelObject = Helpers.createLabelDescriptionFrom(controlElement);
  const allErrors = [].concat(errors).concat(childErrors.map(e => e.message));

  return (
    <Toolbar hidden={true}>
      <Grid container alignItems='center' justify='space-between'>
        <Grid item>
          <Typography type='title'>{label}</Typography>
        </Grid>
        <Grid item hidden={{smUp: allErrors.length === 0}}>
          <ValidationIcon id='tooltip-validation' errorMessages={allErrors}/>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Tooltip id='tooltip-add' title={`Add to ${labelObject.text}`} placement='bottom'>
                <Button
                  fab
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
                <Button
                  fab
                  aria-label={`Delete`}
                  disabled={numSelected === 0}
                  onClick={openConfirmDeleteDialog}
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
