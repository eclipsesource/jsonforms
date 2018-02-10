import * as React from 'react';
import * as _ from 'lodash';
import {
    JsonSchema,
    UISchemaElement,
  } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import Grid from 'material-ui/Grid';

const renderChildren = (
    elements: UISchemaElement[],
    schema: JsonSchema,
    path: string
  ) =>
  elements.map((child, index) =>
      (
        <Grid item key={`${path}-${index}`} xs>
          <JsonForms
            uischema={child}
            schema={schema}
            path={path}
          />
        </Grid>
      )
  );

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
  } else {
    return (
      <Grid container hidden={{ xsUp: !visible }} direction={direction}>
        {renderChildren(elements, schema, path)}
      </Grid>
    );
  }
};
