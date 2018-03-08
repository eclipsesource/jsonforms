/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
