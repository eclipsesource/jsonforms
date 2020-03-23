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
  findUISchema,
  GroupLayout,
  isObjectControl,
  isPlainLabel,
  RankedTester,
  rankWith,
  ControlWithDetailProps
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsDetailProps } from '@jsonforms/react';
import { Hidden, Grid, Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { DeleteProperty } from './DeleteProperty';

const MaterialObjectRenderer = ({
  renderers,
  cells,
  uischemas,
  schema,
  label,
  path,
  visible,
  enabled,
  uischema,
  rootSchema,
  deleteProperty
}: ControlWithDetailProps) => {
  const detailUiSchema = findUISchema(
    uischemas,
    schema,
    uischema.scope,
    path,
    'VerticalLayout',
    uischema,
    rootSchema
  );
  if (isEmpty(path)) {
    detailUiSchema.type = 'VerticalLayout';
  } else {
    (detailUiSchema as GroupLayout).label = startCase(
      isPlainLabel(label) ? label : label.default
    );
  }
  const deleteObject = (close: () => void) => {
    deleteProperty(path);
    close();
  };
  const mainLabel = (detailUiSchema as GroupLayout).label;
  const style: { [x: string]: any } = { marginBottom: '10px' };
  return (
    <Hidden xsUp={!visible}>
      <Card style={style}>
        <CardHeader
          component={
            () => (
              <Grid justify='space-between' className='MuiCardHeader-root'>
                {mainLabel && <Typography variant='h5'>{mainLabel}</Typography>}
                <DeleteProperty
                  onConfirm={deleteObject}
                  title={mainLabel ? `Delete ${mainLabel}` : null}
                />
              </Grid>
            )
          }
        />
        <CardContent>
          <JsonFormsDispatch
            visible={visible}
            enabled={enabled}
            schema={schema}
            uischema={detailUiSchema}
            path={path}
            renderers={renderers}
            cells={cells}
          />
        </CardContent>
      </Card>
    </Hidden>
  );
};

export const materialObjectControlTester: RankedTester = rankWith(
  2,
  isObjectControl
);
export default withJsonFormsDetailProps(MaterialObjectRenderer);
