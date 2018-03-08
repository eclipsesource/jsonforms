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
import * as _ from 'lodash';
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
      selected: this.createSelection(false),
      openConfirmDelete: false
    };
  }

  render() {
    const { visible } = this.props;
    const numSelected = this.state.selected ? _.filter(this.state.selected, v => v).length : 0;
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
    const selectedCount = _.filter(this.state.selected, v => v).length;

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
              Are you sure you want to delete the {selectedCount} selected objects?
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

  private select = (_event, index) => {
    const copy = this.state.selected.slice();
    copy[index] = !copy[index];

    this.setState({ selected: copy });
  }
  private selectAll = (_event, checked) => {
    if (checked) {
      this.setState({ selected: this.createSelection(true) });
      return;
    }
    this.setState({selected: this.createSelection(false) });
  }
  private closeConfirmDeleteDialog = () => {
    this.setState({ openConfirmDelete: false });
  }
  private openConfirmDeleteDialog = () => {
    this.setState({ openConfirmDelete: true });
  }
  private confirmDelete = () => {
    const selectedIndices = this.state.selected;
    const toDelete = selectedIndices.reduce(
      (acc, value, index) => {
        if (value) {
          acc.push(this.props.data[index]);
        }
        return acc;
      },
      []
    );
    this.props.removeItems(this.props.path, toDelete)();
    this.closeConfirmDeleteDialog();
    this.setState({ selected: this.createSelection(false) });
  }
  private isSelected = index => {
    return this.state.selected[index];
  }
  private createSelection = (selected: boolean) => _.fill(Array(this.props.data.length), selected);
}

export interface TableState {
  /**
   * Represents the selected entries of the array.
   */
  selected: boolean[];

  /**
   * Determines whether the confirm deletion dialog is opened.
   */
  openConfirmDelete: boolean;
}

export default connectToJsonForms(
  mapStateToTableControlProps,
  mapDispatchToTableControlProps
)(MaterialArrayControlRenderer);
