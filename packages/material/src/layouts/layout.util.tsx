import * as React from 'react';
import * as _ from 'lodash';
import {
    DispatchRenderer,
    JsonSchema,
    UISchemaElement,
  } from '@jsonforms/core';
import Grid from 'material-ui/Grid';
import { RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';

const renderChildren = (
    elements: UISchemaElement[],
    schema: JsonSchema,
    path: string
  ) => {

    return elements.map((child, index) =>
    (
        <Grid item key={`${path}-${index}`} xs>
          <DispatchRenderer
            uischema={child}
            schema={schema}
            path={path}
          />
        </Grid>
      )
    );
  };
export interface MaterialLayoutRendererProps {
    elements: UISchemaElement[];
    schema: JsonSchema;
    path: string;
    visible: boolean;
    direction: 'row'|'column';
}
export const MaterialLayoutRenderer = (
    {visible, elements, schema, path, direction}: MaterialLayoutRendererProps) => {
        if (_.isEmpty(elements)) {
            return null;
        }
        else {
            return (
                <Grid container hidden={{ xsUp: !visible }} direction={direction}>
                    {renderChildren(elements, schema, path)}
                </Grid>
            );
        }
    };
