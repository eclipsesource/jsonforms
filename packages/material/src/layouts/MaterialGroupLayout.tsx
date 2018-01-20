import Card from 'material-ui/Card';
import CardHeader from 'material-ui/Card';
import * as React from 'react';
import {
    GroupLayout,
    JsonForms,
    mapStateToLayoutProps,
    RankedTester,
    rankWith,
    registerStartupRenderer,
    RendererProps,
    uiTypeIs,
    withIncreasedRank
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from './layout.util';

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export const MaterializedGroupLayoutRenderer = (props: RendererProps) => {
    const { uischema, schema, path, visible } = props;

    const groupLayout = uischema as GroupLayout;
    const classNames = JsonForms.stylingRegistry.getAsClassName('group-layout');

    const childProps: MaterialLayoutRendererProps = {
        elements: groupLayout.elements,
        schema,
        path,
        direction: 'column',
        visible
    };

    return (
        <Card className={classNames} style={{marginBottom: '10px' }}>
            !_.isEmpty(groupLayout.label) ?
                <CardHeader>
                    {groupLayout.label}
                </CardHeader>
            <MaterialLayoutRenderer {...childProps}/>;
        </Card>
        );
};

export default registerStartupRenderer(
    withIncreasedRank(1, groupTester),
    connect(mapStateToLayoutProps)(MaterializedGroupLayoutRenderer)
);
