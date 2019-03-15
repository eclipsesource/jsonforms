import React from 'react';
import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

export interface DeleteDialogProps {
    open: boolean;
    onClose(): void;
    onConfirm(): void;
    onCancel(): void;
}

export interface WithDeleteDialogSupport {
  openDeleteDialog(path: string, data: number): void;
}

export const DeleteDialog = React.memo(({ open, onClose, onConfirm, onCancel }: DeleteDialogProps) => {
    return (
        <Dialog
            open={open}
            keepMounted
            onClose={onClose}
            aria-labelledby='alert-dialog-confirmdelete-title'
            aria-describedby='alert-dialog-confirmdelete-description'
        >
            <DialogTitle id='alert-dialog-confirmdelete-title'>
                {'Confirm Deletion'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-confirmdelete-description'>
                    Are you sure you want to delete the selected entry?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color='primary'>
                    No
                </Button>
                <Button onClick={onConfirm} color='primary'>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
});
