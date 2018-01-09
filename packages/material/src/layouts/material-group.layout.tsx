import Card from 'material-ui/Card';
import * as React from 'react';
import * as _ from 'lodash';
import {
    GroupLayout,
    JsonForms,
    mapStateToLayoutProps,
    registerStartupRenderer,
    renderChildren,
    RendererProps,
    withIncreasedRank
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { groupTester } from './group.layout';

export const MaterializedGroupLayoutRenderer = (props: RendererProps) => {
    const { uischema, schema, path } = props;

    const group = uischema as GroupLayout;
    const classNames = JsonForms.stylingRegistry.getAsClassName('group-layout');

    return (
            <div style={ {marginBottom: '10px' }}>
                <Card className={classNames}
                    style={{ padding: '10px 12px 10px 12px',
                        color: 'rgba(0, 0, 0, 0.54)' }}>
                    {
                        !_.isEmpty(group.label) ?
                            <div className={JsonForms.stylingRegistry.getAsClassName
                            ('group.label')}
                            style={{ marginBottom: '15px' }}>
                                {group.label}
                            </div> : ''
                    }
                    {
                        renderChildren(
                            group.elements,
                            schema,
                            'group-layout-item',
                            path
                        )
                    }
                </Card>
            </div>
        );
};

export default registerStartupRenderer(
    withIncreasedRank(1, groupTester),
    connect(mapStateToLayoutProps)(MaterializedGroupLayoutRenderer)
);
