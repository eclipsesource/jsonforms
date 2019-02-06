import React from 'react';
import { connect } from 'react-redux';

import {
  ControlProps,
  isAllOfControl,
  JsonSchema,
  mapStateToControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import { createCombinatorRenderInfos, resolveSubSchemas } from './combinators';

class MaterialAllOfRenderer extends React.Component<ControlProps, any> {

  render() {

    const {
      schema,
      rootSchema,
      path
    } = this.props;

    const _schema = resolveSubSchemas(schema, rootSchema, 'allOf');
    const allOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).allOf, rootSchema, 'allOf');

    return (
      <React.Fragment>
        {
          allOfRenderInfos.map((allOfRenderInfo, allOfIndex) => (
            <ResolvedJsonForms
              key={allOfIndex}
              schema={allOfRenderInfo.schema}
              uischema={allOfRenderInfo.uischema}
              path={path}
            />
          ))
        }
      </React.Fragment>
    );
  }
}

const ConnectedMaterialAllOfRenderer = connect(
  mapStateToControlProps
)(MaterialAllOfRenderer);

export const materialAllOfControlTester: RankedTester = rankWith(2, isAllOfControl);
export default ConnectedMaterialAllOfRenderer;
