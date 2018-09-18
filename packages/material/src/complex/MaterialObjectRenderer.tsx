import * as React from 'react';
import {
    ControlProps,
    findUISchema,
    isObjectControl,
    JsonSchema,
    mapStateToControlProps,
    RankedTester,
    rankWith,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import { MaterialLayoutRenderer } from '../util/layout';

interface MaterialObjectRendererProps extends ControlProps {
    findUiSchema(
        schema: JsonSchema,
        schemaPath: string,
        instancePath: string,
        fallbackLayoutType: string
    );
}

class MaterialObjectRenderer extends React.Component<MaterialObjectRendererProps, any> {
    render() {
        const {
            findUiSchema,
            schema,
            path,
            visible,
        } = this.props;

        const style: {[x: string]: any} = { marginBottom: '10px' };
        if (!visible) {
            style.display = 'none';
        }

        const detailUiSchema = findUiSchema(schema, undefined, path, 'Group');

        return (
          <MaterialLayoutRenderer
            visible={visible}
            schema={schema}
            direction={'column'}
            elements={detailUiSchema.elements}
            path={''}
          />
        );
    }
}

const mapStateToObjectControlProps = (state, ownProps) => {
    const props =  mapStateToControlProps(state, ownProps);
    return {
        ...props,
        findUiSchema: findUISchema(state)
    };
};

const ConnectedMaterialObjectRenderer = connectToJsonForms(
    mapStateToObjectControlProps
)(MaterialObjectRenderer);

export const materialObjectControlTester: RankedTester = rankWith(2, isObjectControl);
export default ConnectedMaterialObjectRenderer;
