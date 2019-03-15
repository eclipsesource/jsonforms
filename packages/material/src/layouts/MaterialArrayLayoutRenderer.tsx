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
  ArrayLayoutProps,
  isObjectArrayWithNesting,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { MaterialArrayLayout } from './MaterialArrayLayout';
import { connect } from 'react-redux';
import { Hidden } from '@material-ui/core';

export class MaterialArrayLayoutRenderer extends React.Component<ArrayLayoutProps, any> {
  addItem = (path: string, value: any) => this.props.addItem(path, value);
  render() {
    return (
      <Hidden xsUp={!this.props.visible}>
        <MaterialArrayLayout
          label={this.props.label}
          uischema={this.props.uischema}
          schema={this.props.schema}
          id={this.props.id}
          rootSchema={this.props.rootSchema}
          errors={this.props.errors}
          enabled={this.props.enabled}
          visible={this.props.visible}
          data={this.props.data}
          path={this.props.path}
          addItem={this.addItem}
          renderers={this.props.renderers}
        />
      </Hidden>
    );
  }
}

const ConnectedMaterialArrayLayoutRenderer = connect(
  mapStateToArrayLayoutProps,
  mapDispatchToArrayControlProps
)(MaterialArrayLayoutRenderer);

export default ConnectedMaterialArrayLayoutRenderer;
ConnectedMaterialArrayLayoutRenderer.displayName = 'MaterialArrayLayoutRenderer';

export const materialArrayLayoutTester: RankedTester = rankWith(4, isObjectArrayWithNesting);
