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
import React from 'react';
import {
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import {
  MaterialLayoutRenderer,
  MaterialLayoutRendererProps,
} from '../util/layout';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const materialVerticalLayoutTester: RankedTester = rankWith(
  1,
  uiTypeIs('VerticalLayout')
);

export const MaterialVerticalLayoutRenderer = ({
  uischema,
  schema,
  path,
  enabled,
  visible,
  renderers,
  cells,
}: LayoutProps) => {
  const verticalLayout = uischema as VerticalLayout;
  const childProps: MaterialLayoutRendererProps = {
    elements: verticalLayout.elements,
    schema,
    path,
    enabled,
    direction: 'column',
    visible,
  };

  return (
    <MaterialLayoutRenderer
      {...childProps}
      renderers={renderers}
      cells={cells}
    />
  );
};

export default withJsonFormsLayoutProps(MaterialVerticalLayoutRenderer);
