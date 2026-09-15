import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface TabSwitchConfirmDialogProps {
  open: boolean;
  handleClose: () => void;
  confirm: () => void;
  cancel: () => void;
  id: string;
}

export const TabSwitchConfirmDialog = ({
  open,
  handleClose,
  confirm,
  cancel,
  id,
}: TabSwitchConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'Clear form?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Your data will be cleared if you navigate away from this tab. Do you
          want to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color='primary'>
          No
        </Button>
        <Button
          onClick={confirm}
          color='primary'
          autoFocus
          id={`${id}-confirm-yes`}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
