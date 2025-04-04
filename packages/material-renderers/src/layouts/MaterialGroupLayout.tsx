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
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  GroupLayout,
  isVisible,
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
  withIncreasedRank,
} from '@mosaic-avantos/jsonforms-core';
import {
  AjvProps,
  MaterialLabelableLayoutRendererProps,
  MaterialLayoutRenderer,
  withAjvProps,
} from '../util/layout';
import { withJsonFormsLayoutProps } from '@mosaic-avantos/jsonforms-react';

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));
const style: { [x: string]: any } = { marginBottom: '10px' };

export interface MaterializedGroupLayoutRendererProps
  extends LayoutProps,
    AjvProps {
  data?: any;
}

const GroupComponent = React.memo(function GroupComponent({
  visible,
  enabled,
  uischema,
  label,
  ...props
}: MaterialLabelableLayoutRendererProps) {
  const groupLayout = uischema as GroupLayout;

  if (!visible) {
    return null;
  }

  return (
    <Card style={style}>
      {!isEmpty(label) && <CardHeader title={label} />}
      <CardContent>
        <MaterialLayoutRenderer
          {...props}
          visible={visible}
          enabled={enabled}
          elements={groupLayout.elements}
        />
      </CardContent>
    </Card>
  );
});

export const MaterializedGroupLayoutRenderer = ({
  uischema,
  schema,
  path,
  visible,
  enabled,
  renderers,
  cells,
  direction,
  label,
  ajv,
  data,
}: MaterializedGroupLayoutRendererProps) => {
  const groupLayout = uischema as GroupLayout;

  const visibleElements = groupLayout.elements?.filter((element) =>
    isVisible(element, data, path, ajv)
  );

  return (
    <GroupComponent
      elements={visibleElements}
      schema={schema}
      path={path}
      direction={direction}
      visible={visible}
      enabled={enabled}
      uischema={uischema}
      renderers={renderers}
      cells={cells}
      label={label}
    />
  );
};

export default withAjvProps(
  withJsonFormsLayoutProps(MaterializedGroupLayoutRenderer)
);

export const materialGroupTester: RankedTester = withIncreasedRank(
  1,
  groupTester
);
