import * as React from 'react';

import {
    Categorization,
    Category,
    ControlElement,
    ControlProps,
    createCleanLabel,
    generateDefaultUISchema,
    isAnyOfControl,
    JsonSchema,
    mapStateToControlProps,
    RankedTester,
    rankWith,
    toDataPath,
    UISchemaElement,
} from '@jsonforms/core';
import { connectToJsonForms, JsonForms } from '@jsonforms/react';

const createControls =
    (anyOf: JsonSchema[], schema: JsonSchema, scope: string): UISchemaElement => {
        const categorization: Categorization = {
            label: scope,
            type: 'Categorization',
            elements: []
        };
        return anyOf.map((subSchema, index) => {
                let label = toDataPath(scope);
                if (subSchema.type === 'object') {
                    label = createCleanLabel(Object.keys(subSchema.properties)[0]) + '...';
                }
                return {
                    uischema: generateDefaultUISchema(
                        subSchema,
                        'VerticalLayout',
                        `${scope}/anyOf/${index}`,
                        schema
                    ),
                    label
                };
            }
        ).reduce(
            (layout, element) => {
                const category: Category = {
                    type: 'Category',
                    label: element.label,
                    elements: [element.uischema]
                };
                return {
                    ...layout,
                    elements: (layout as Categorization).elements.slice().concat([category])
                };
            },
            categorization
        );
    };

class MaterialAnyOfRenderer extends React.Component<ControlProps, any> {

    render() {

        const {
            schema,
            uischema,
            scopedSchema,
        } = this.props;

        const elements = createControls(
            (scopedSchema as JsonSchema).anyOf,
            schema,
            (uischema as ControlElement).scope
        );

        return (
            <JsonForms
                schema={schema}
                uischema={elements}
            />
        );

    }
}

const ConnectedMaterialAnyOfRenderer = connectToJsonForms(
    mapStateToControlProps
)(MaterialAnyOfRenderer);
ConnectedMaterialAnyOfRenderer.displayName = 'MaterialAnyOfRenderer';
export const materialAnyOfControlTester: RankedTester = rankWith(2, isAnyOfControl);
export default ConnectedMaterialAnyOfRenderer;
