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
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import {
  and,
  Categorization,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  Tester,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core';
import { connectToJsonForms, RendererComponent } from '@jsonforms/react';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

const isSingleLevelCategorization: Tester = and(
    uiTypeIs('Categorization'),
    (uischema: UISchemaElement): boolean => {
      const categorization = uischema as Categorization;

      return categorization.elements.reduce((acc, e) => acc && e.type === 'Category', true);
    }
);

export const materialCategorizationTester: RankedTester = rankWith(1, isSingleLevelCategorization);
export interface CategorizationState {
    value: number;
  }

export class MaterialCategorizationLayoutRenderer
    extends RendererComponent<RendererProps, CategorizationState> {
    constructor(props) {
      super(props);

      this.state = {
        value: 0
      };
    }

    render() {
        const { uischema, schema, path, visible } = this.props;
        const { value } = this.state;

        const categorization = uischema as Categorization;

        const childProps: MaterialLayoutRendererProps = {
            elements: categorization.elements[value].elements,
            schema,
            path,
            direction: 'column',
            visible
        };
        const style: {[x: string]: any} = { marginBottom: '10px' };
        if (!visible) {
            style.display = 'none';
        }

        return (
            <div style={style}>
                <AppBar position='static'>
                <Tabs value={value} onChange={this.handleChange}>
                    {categorization.elements.map((e, idx) => <Tab  key={idx} label={e.label} />)}
                </Tabs>
                </AppBar>
                <div style={{ marginTop: '0.5em' }}>
                    <MaterialLayoutRenderer {...childProps}/>
                </div>
            </div>
        );
    }
    private handleChange = (_event, value) => {
        this.setState({ value });
    }
}

export default connectToJsonForms(
  mapStateToLayoutProps
)(MaterialCategorizationLayoutRenderer);
