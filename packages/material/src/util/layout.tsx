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
import React from 'react';
import {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfRenderer,
  UISchemaElement
} from '@jsonforms/core';
import { areEqual, JsonFormsDispatch } from '@jsonforms/react';
import { Grid, Hidden } from '@material-ui/core';

export const renderLayoutElements = (
  elements: UISchemaElement[],
  schema: JsonSchema,
  path: string,
  enabled: boolean,
  renderers?: JsonFormsRendererRegistryEntry[]
) => {
  return elements.map((child, index) => (
    <Grid item key={`${path}-${index}`} xs>
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={enabled}
        renderers={renderers}
      />
    </Grid>
  ));
};

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[];
  direction: 'row' | 'column';
  renderers?: JsonFormsRendererRegistryEntry[];
}
export const MaterialLayoutRenderer = React.memo(
  ({
    visible,
    elements,
    schema,
    path,
    enabled,
    direction,
    renderers
  }: MaterialLayoutRendererProps) => {
    if (isEmpty(elements)) {
      return null;
    } else {
      return (
        <Hidden xsUp={!visible}>
          <Grid
            container
            direction={direction}
            spacing={direction === 'row' ? 2 : 0}
          >
            {renderLayoutElements(elements, schema, path, enabled, renderers)}
          </Grid>
        </Hidden>
      );
    }
  },
  areEqual
);
