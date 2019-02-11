import React from 'react';
import { connect } from 'react-redux';

import {
  ControlProps,
  isAnyOfControl,
  JsonSchema,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import CombinatorProperties from './CombinatorProperties';
import { createCombinatorRenderInfos, resolveSubSchemas } from './combinators';
import { Tab, Tabs } from '@material-ui/core';

interface MaterialAnyOfState {
  selectedAnyOf: number;
}

class MaterialAnyOfRenderer extends React.Component<ControlProps, MaterialAnyOfState> {

  state: MaterialAnyOfState = {
    selectedAnyOf: 0
  };

  handleChange = (_event: any, value: number) => {
    this.setState({ selectedAnyOf: value });
  };

  render() {

    const anyOf = 'anyOf';
    const { path, schema, rootSchema } = this.props;
    const _schema = resolveSubSchemas(schema, rootSchema, anyOf);
    const anyOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).anyOf, rootSchema, anyOf);

    return (
      <React.Fragment>
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
            this.state.selectedAnyOf === anyOfIndex && <ResolvedJsonForms
              schema={anyOfRenderInfo.schema}
              uischema={anyOfRenderInfo.uischema}
              path={path}
            />
          ))
        }
      </React.Fragment>
    );
  }
}

const ConnectedMaterialAnyOfRenderer = connect(
  mapStateToControlProps
)(MaterialAnyOfRenderer);
ConnectedMaterialAnyOfRenderer.displayName = 'MaterialAnyOfRenderer';
export const materialAnyOfControlTester: RankedTester = rankWith(2, isAnyOfControl);
export default ConnectedMaterialAnyOfRenderer;
