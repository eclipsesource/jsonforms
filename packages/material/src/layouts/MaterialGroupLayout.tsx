import * as React from 'react';
import * as _ from 'lodash';
import { Card, CardContent, CardHeader } from 'material-ui';
import {
  GroupLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
  withIncreasedRank
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export const MaterializedGroupLayoutRenderer = (props: RendererProps) => {
    const { uischema, schema, path, visible } = props;

    const groupLayout = uischema as GroupLayout;

    const childProps: MaterialLayoutRendererProps = {
        elements: groupLayout.elements,
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
        <Card style={style}>
          {!_.isEmpty(groupLayout.label) && <CardHeader title={groupLayout.label}/>}
          <CardContent>
            <MaterialLayoutRenderer {...childProps}/>
          </CardContent>
        </Card>
    );
};

export default connectToJsonForms(
  mapStateToLayoutProps
)(MaterializedGroupLayoutRenderer);

export const materialGroupTester: RankedTester = withIncreasedRank(1, groupTester);
