import * as React from 'react';

import {
  mapDispatchToTableControlProps,
  mapStateToTableControlProps,
  TableControlProps
} from '@jsonforms/core';
import { connectToJsonForms, RendererComponent } from '@jsonforms/react';
import { TableToolbar } from './TableToolbar';
import { MaterialTableControl } from './MaterialTableControl';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';

export class MaterialArrayControlRenderer extends RendererComponent<TableControlProps, TableState> {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      openConfirmDelete: false
    };
  }

  render() {
    const { visible } = this.props;

    const numSelected = this.state.selected ? this.state.selected.length : 0;
    const tableProps = {
      selectAll: this.selectAll,
      select: this.select,
      isSelected: this.isSelected,
      numSelected,
      ...this.props
    };

    const toolbarProps = {
      openConfirmDeleteDialog: this.openConfirmDeleteDialog,
      numSelected,
      ...this.props
    };

    return (
      <Grid container direction='column' hidden={{ xsUp: !visible }} spacing={0}>
        <Grid item>
          <TableToolbar {...toolbarProps}/>
        </Grid>
        <Grid item>
          <MaterialTableControl {...tableProps}/>
        </Grid>
        <Dialog
          open={this.state.openConfirmDelete}
          keepMounted
          onClose={this.closeConfirmDeleteDialog}
          aria-labelledby='alert-dialog-confirmdelete-title'
          aria-describedby='alert-dialog-confirmdelete-description'
        >
          <DialogTitle id='alert-dialog-confirmdelete-title'>
            {'Confirm Deletion'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-confirmdelete-description'>
              Are you sure you want to delete the {this.state.selected.length} selected objects?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDeleteDialog} color='primary'>
              No
            </Button>
            <Button onClick={this.confirmDelete} color='primary'>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }

  private select = (_event, child) => {
    const selected = this.state.selected.filter(s => this.props.data.indexOf(s) !== -1);
    const selectedIndex: number = selected.indexOf(child);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, child);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  }
  private selectAll = (_event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.data });

      return;
    }
    this.setState({ selected: [] });
  }
  private closeConfirmDeleteDialog = () => {
    this.setState({ openConfirmDelete: false });
  }
  private openConfirmDeleteDialog = () => {
    this.setState({ openConfirmDelete: true });
  }
  private confirmDelete = () => {
    this.props.removeItems(this.props.path, this.state.selected)();
    this.closeConfirmDeleteDialog();
    this.setState({selected: []});
  }
  private isSelected = child => this.state.selected.indexOf(child) !== -1;
}

export interface TableState {
  selected: any[];
  openConfirmDelete: boolean;
}

export default connectToJsonForms(
  mapStateToTableControlProps,
  mapDispatchToTableControlProps
)(MaterialArrayControlRenderer);
