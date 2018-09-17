import * as React from 'react';
import * as _ from 'lodash';
import {
    ControlElement,
    ControlProps,
    Generate,
    isObjectControl,
    JsonSchema,
    mapStateToControlProps,
    RankedTester,
    rankWith,
    resolveSchema,
    UISchemaElement
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { MaterialLayoutRenderer } from '../util/layout';

const createControls = (schema: JsonSchema, path: string): UISchemaElement[] => {
    const obj =  resolveSchema(schema, path);
    return Object.keys(obj).map(key => Generate.controlElement(key, `${path}/${key}`));
};

class MaterialObjectRenderer extends React.Component<ControlProps, any> {
    render() {
        const {
            uischema,
            schema,
            visible,
           } = this.props;

        const controlElement = uischema as ControlElement;
        const scope = controlElement.scope;
        const elements: UISchemaElement[] = createControls(schema, (`${scope || '#'}/properties`));
        const style: {[x: string]: any} = { marginBottom: '10px' };
        if (!visible) {
            style.display = 'none';
        }

        return (
            <Card style={style}>
                {!_.isEmpty(controlElement.label) && <CardHeader title={controlElement.label}/>}
                <CardContent>
                    <MaterialLayoutRenderer
                        visible={visible}
                        schema={schema}
                        direction={'column'}
                        elements={elements}
                        path={''}
                    />
                </CardContent>
            </Card>
        );
    }
}

const ConnectedMaterialObjectRenderer = connectToJsonForms(
    mapStateToControlProps
)(MaterialObjectRenderer);

export const materialObjectControlTester: RankedTester = rankWith(2, isObjectControl);
export default ConnectedMaterialObjectRenderer;
