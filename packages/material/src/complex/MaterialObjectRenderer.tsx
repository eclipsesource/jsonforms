import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import {
  ControlProps,
  findUISchema,
  GroupLayout,
  isObjectControl,
  JsonFormsState,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  OwnPropsOfControl,
  RankedTester,
  rankWith,
  UISchemaElement
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import { Hidden } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

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
            schema,
            path,
            visible,
        } = this.props;

        const detailUiSchema = findUiSchema(schema, undefined, path, 'Group');
        if (isEmpty(path)) {
            detailUiSchema.type = 'VerticalLayout';
        } else {
            (detailUiSchema as GroupLayout).label = startCase(path);
        }
        return (
            <Hidden xsUp={!visible}>
                <ResolvedJsonForms
                    visible={visible}
                    schema={schema}
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

const ConnectedMaterialObjectRenderer = connect(
  mapStateToObjectControlProps,
  mapDispatchToControlProps
)(MaterialObjectRenderer);

export const materialObjectControlTester: RankedTester = rankWith(2, isObjectControl);
export default ConnectedMaterialObjectRenderer;
