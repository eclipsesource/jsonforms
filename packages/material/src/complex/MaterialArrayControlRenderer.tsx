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
  ArrayControlProps,
  ArrayLayoutProps,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
} from '@jsonforms/core';
import { RendererComponent } from '@jsonforms/react';
import { MaterialTableControl } from './MaterialTableControl';
import { Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { DeleteDialog } from './DeleteDialog';

export class MaterialArrayControlRenderer extends RendererComponent<ArrayLayoutProps, any> {

  constructor(props: ArrayControlProps) {
    super(props);
    this.state = {
      open: false,
      path: undefined,
      rowData: undefined
    };
  }

  openDeleteDialog = (path: string, rowData: number) => {
    this.setState({
      open: true,
      path,
      rowData
    });
  };
  deleteCancel = () => this.setState({open: false});
  deleteConfirm = () => {
    const path = this.state.path.substring(0, this.state.path.lastIndexOf(('.')));
    this.props.removeItems(path, [this.state.rowData])();
    this.setState({open: false});
  };
  deleteClose = () => this.setState({open: false});
  render() {
    const { visible } = this.props;

    return (
      <Hidden xsUp={!visible}>
        <MaterialTableControl
          {...this.props}
          openDeleteDialog={this.openDeleteDialog}
        />
        <DeleteDialog
          open={this.state.open}
          onCancel={this.deleteCancel}
          onConfirm={this.deleteConfirm}
          onClose={this.deleteClose}
        />
      </Hidden>
    );
  }
}

export default connect(
  mapStateToArrayLayoutProps,
  mapDispatchToArrayControlProps
)(MaterialArrayControlRenderer);
