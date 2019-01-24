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
import {
  ArrayControlProps,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
} from '@jsonforms/core';
import { RendererComponent } from '@jsonforms/react';
import { MaterialTableControl } from './MaterialTableControl';
import { Hidden } from '@material-ui/core';
import { connect } from 'react-redux';
import { DeleteDialog } from './DeleteDialog';

export class MaterialArrayControlRenderer extends RendererComponent<ArrayControlProps, any> {

  constructor(props: ArrayControlProps) {
    super(props);
    this.state = {
      open: false,
      path: undefined,
      rowData: undefined
    };
  }

  openDeleteDialog = (path: string, rowData: any) => {
    this.setState({
      open: true,
      path,
      rowData
    });
  }

  render() {
    const { visible, removeItems } = this.props;

    return (
      <React.Fragment>
        <Hidden xsUp={!visible}>
          <MaterialTableControl
            {...this.props}
            openDeleteDialog={this.openDeleteDialog}
          />
        </Hidden>
        <DeleteDialog
          open={this.state.open}
          onCancel={() => this.setState({open: false})}
          onConfirm={() => {
            const path = this.state.path.substring(0, this.state.path.lastIndexOf(('.')));
            removeItems(path, [this.state.rowData])();
            this.setState({open: false});
          }}
          onClose={() => this.setState({open: false})}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToArrayControlProps,
  mapDispatchToArrayControlProps
)(MaterialArrayControlRenderer);
