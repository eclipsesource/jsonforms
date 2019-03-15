import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import {
  ControlWithDetailProps,
  findUISchema,
  GroupLayout,
  isObjectControl,
  mapDispatchToControlProps,
  mapStateToControlWithDetailProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { ResolvedJsonForms } from '@jsonforms/react';
import { Hidden } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

class MaterialObjectRenderer extends React.Component<ControlWithDetailProps, any> {
    render() {
        const {
            uischemas,
            schema,
            path,
            visible,
        } = this.props;

        const detailUiSchema = findUISchema(uischemas, schema, undefined, path, 'Group');
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

const ConnectedMaterialObjectRenderer = connect(
  mapStateToControlWithDetailProps,
  mapDispatchToControlProps
)(MaterialObjectRenderer);

export const materialObjectControlTester: RankedTester = rankWith(2, isObjectControl);
export default ConnectedMaterialObjectRenderer;
