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
import {
  ControlProps,
  findUISchema,
  Generate,
  GroupLayout,
  isObjectControl,
  RankedTester,
  rankWith,
  UISchemaElement,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  useJsonForms,
  withJsonFormsControlProps,
} from '@jsonforms/react';
import React, { useMemo } from 'react';
import { MaterialAdditionalProperties } from './MaterialAdditionalProperties';
import { Card, CardContent, CardHeader } from '@mui/material';

const objectCardStyle: { [x: string]: any } = { marginBottom: '10px' };

const withoutGroupFrame = (uischema: UISchemaElement): UISchemaElement => {
  if (uischema.type !== 'Group') {
    return uischema;
  }

  const { label: _label, ...layout } = uischema as GroupLayout;
  return {
    ...layout,
    type: 'VerticalLayout',
  };
};

export const MaterialObjectRenderer = ({
  cells,
  config,
  data,
  enabled,
  handleChange,
  label,
  path,
  readonly,
  renderers,
  schema,
  uischema,
  rootSchema,
  visible,
}: ControlProps) => {
  const jsonforms = useJsonForms();
  const uischemas = jsonforms.uischemas ?? [];
  const detailUiSchema = useMemo(
    () =>
      findUISchema(
        uischemas,
        schema,
        uischema.scope,
        path,
        () =>
          Generate.uiSchema(schema, 'VerticalLayout', undefined, rootSchema),
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );
  const dispatchUiSchema = useMemo(
    () => (isEmpty(path) ? detailUiSchema : withoutGroupFrame(detailUiSchema)),
    [detailUiSchema, path]
  );
  const objectLabel =
    detailUiSchema.type === 'Group'
      ? (detailUiSchema as GroupLayout).label ?? label
      : label;

  if (!visible) {
    return null;
  }

  const content = (
    <>
      <JsonFormsDispatch
        visible={visible}
        enabled={enabled}
        schema={schema}
        uischema={dispatchUiSchema}
        path={path}
        renderers={renderers}
        cells={cells}
        readonly={readonly}
      />
      <MaterialAdditionalProperties
        cells={cells}
        config={config}
        data={data}
        enabled={enabled}
        handleChange={handleChange}
        label={label}
        path={path}
        readonly={readonly}
        renderers={renderers}
        rootSchema={rootSchema}
        schema={schema}
        uischema={uischema}
        uischemas={uischemas}
      />
    </>
  );

  if (isEmpty(path)) {
    return content;
  }

  return (
    <Card style={objectCardStyle} variant='outlined'>
      {!isEmpty(objectLabel) && <CardHeader title={objectLabel} />}
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export const materialObjectControlTester: RankedTester = rankWith(
  2,
  isObjectControl
);

export default withJsonFormsControlProps(MaterialObjectRenderer);
