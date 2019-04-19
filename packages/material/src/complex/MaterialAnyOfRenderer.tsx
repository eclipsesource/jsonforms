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
import { connect } from 'react-redux';

import {
  createCombinatorRenderInfos,
  isAnyOfControl,
  JsonSchema,
  mapStateToAnyOfProps,
  RankedTester,
  rankWith,
  resolveSubSchemas,
  StatePropsOfCombinator
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import CombinatorProperties from './CombinatorProperties';
import { Hidden, Tab, Tabs } from '@material-ui/core';

interface MaterialAnyOfState {
  selectedAnyOf: number;
}

class MaterialAnyOfRenderer extends React.Component<StatePropsOfCombinator, MaterialAnyOfState> {

  state: MaterialAnyOfState = {
    selectedAnyOf: 0
  };

  constructor(props: StatePropsOfCombinator) {
    super(props);
    const {indexOfFittingSchema} = this.props;
    if (indexOfFittingSchema) {
      this.state.selectedAnyOf = indexOfFittingSchema;
    }
  }

  handleChange = (_event: any, value: number) => {
    this.setState({ selectedAnyOf: value });
  };

  render() {

    const anyOf = 'anyOf';
    const { path, schema, rootSchema, visible } = this.props;
    const _schema = resolveSubSchemas(schema, rootSchema, anyOf);
    const anyOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).anyOf, rootSchema, anyOf);

    return (
      <Hidden xsUp={!visible}>
        <CombinatorProperties
          schema={_schema}
          combinatorKeyword={'anyOf'}
          path={path}
        />
        <Tabs value={this.state.selectedAnyOf} onChange={this.handleChange}>
          {anyOfRenderInfos.map(anyOfRenderInfo => <Tab key={anyOfRenderInfo.label} label={anyOfRenderInfo.label}/>)}
        </Tabs>
        {
          anyOfRenderInfos.map((anyOfRenderInfo, anyOfIndex) => (
            this.state.selectedAnyOf === anyOfIndex &&
            <ResolvedJsonForms
              key={anyOfIndex}
              schema={anyOfRenderInfo.schema}
              uischema={anyOfRenderInfo.uischema}
              path={path}
            />
          ))
        }
      </Hidden>
    );
  }
}

const ConnectedMaterialAnyOfRenderer = connect(
  mapStateToAnyOfProps
)(MaterialAnyOfRenderer);
ConnectedMaterialAnyOfRenderer.displayName = 'MaterialAnyOfRenderer';
export const materialAnyOfControlTester: RankedTester = rankWith(2, isAnyOfControl);
export default ConnectedMaterialAnyOfRenderer;
