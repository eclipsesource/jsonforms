import * as React from 'react';
import * as _ from 'lodash';
import { Card, CardContent, CardHeader } from 'material-ui';
import {
    GroupLayout,
    mapStateToLayoutProps,
    RankedTester,
    rankWith,
    registerStartupRenderer,
    RendererProps,
    uiTypeIs,
    withIncreasedRank
} from '@jsonforms/core';
import { connect } from 'react-redux';
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

    return (
        <Card style={{ marginBottom: '10px' }}>
          {
            !_.isEmpty(groupLayout.label) &&
            <CardHeader title={groupLayout.label}/>
          }
          <CardContent>
            <MaterialLayoutRenderer {...childProps}/>
          </CardContent>
        </Card>
    );
};

export default registerStartupRenderer(
    withIncreasedRank(1, groupTester),
    connect(mapStateToLayoutProps)(MaterializedGroupLayoutRenderer)
);
