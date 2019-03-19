import React from 'react';
import { connect } from 'react-redux';
import { Hidden } from '@material-ui/core';

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
      path,
      visible
    } = this.props;

    const _schema = resolveSubSchemas(schema, rootSchema, 'allOf');
    const allOfRenderInfos = createCombinatorRenderInfos((_schema as JsonSchema).allOf, rootSchema, 'allOf');

    return (
      <Hidden xsUp={!visible}>
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
      </Hidden>
    );
  }
}

const ConnectedMaterialAllOfRenderer = connect(
  mapStateToControlProps
)(MaterialAllOfRenderer);

export const materialAllOfControlTester: RankedTester = rankWith(2, isAllOfControl);
export default ConnectedMaterialAllOfRenderer;
