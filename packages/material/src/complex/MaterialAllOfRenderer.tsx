import React from 'react';
import { connect } from 'react-redux';

import {
    ControlElement,
    ControlProps,
    generateDefaultUISchema,
    isAllOfControl,
    JsonSchema,
    mapStateToControlProps,
    RankedTester,
    rankWith,
    UISchemaElement,
    VerticalLayout
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';

const createControls =
    (allOf: JsonSchema[], schema: JsonSchema, scope: string): UISchemaElement => {
        const verticalLayout: VerticalLayout = { type: 'VerticalLayout', elements: [] };
        return allOf.map((subSchema, index) =>
            generateDefaultUISchema(subSchema, 'VerticalLayout', `${scope}/allOf/${index}`, schema)
        ).reduce(
            (layout, element) => {
                return {
                    ...layout,
                    elements: (layout as VerticalLayout).elements.slice().concat([element])
                };
            },
            verticalLayout
        );
    };

class MaterialAllOfRenderer extends React.Component<ControlProps, any> {

    render() {

        const {
            schema,
            uischema,
            scopedSchema,
            path
        } = this.props;

        const elements = createControls(
            (scopedSchema as JsonSchema).allOf,
            schema,
            (uischema as ControlElement).scope
        );

        return (
            <ResolvedJsonForms
                schema={schema}
                uischema={elements}
                path={path}
            />
        );

    }
}

const ConnectedMaterialAllOfRenderer = connect(
    mapStateToControlProps
)(MaterialAllOfRenderer);

export const materialAllOfControlTester: RankedTester = rankWith(2, isAllOfControl);
export default ConnectedMaterialAllOfRenderer;
