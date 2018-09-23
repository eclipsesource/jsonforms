import {
    ControlProps,
    findUISchema,
    GroupLayout,
    isObjectControl,
    JsonFormsState,
    JsonSchema,
    mapStateToControlProps,
    OwnPropsOfControl,
    RankedTester,
    rankWith,
    UISchemaElement
} from '@jsonforms/core';
import { connectToJsonForms, JsonForms } from '@jsonforms/react';
import { Hidden } from '@material-ui/core';
import * as _ from 'lodash';
import * as React from 'react';

interface MaterialObjectRendererProps extends ControlProps {
    findUiSchema(
        schema: JsonSchema,
        schemaPath: string,
        instancePath: string,
        fallbackLayoutType: string
    ): UISchemaElement;
}

class MaterialObjectRenderer extends React.Component<MaterialObjectRendererProps, any> {
    render() {
        const {
            findUiSchema,
            scopedSchema,
            path,
            visible,
        } = this.props;

        const detailUiSchema = findUiSchema(scopedSchema, undefined, path, 'Group');
        if (_.isEmpty(path)) {
            detailUiSchema.type = 'VerticalLayout';
        } else {
            (detailUiSchema as GroupLayout).label = _.startCase(path);
        }

        return (
            <Hidden xsUp={!visible}>
                <JsonForms
                    visible={visible}
                    schema={scopedSchema}
                    uischema={detailUiSchema}
                    path={path}
                />
            </Hidden>
        );
    }
}

const mapStateToObjectControlProps = (state: JsonFormsState, ownProps: OwnPropsOfControl) => {
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
