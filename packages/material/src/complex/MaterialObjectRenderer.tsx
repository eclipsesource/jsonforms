/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
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
