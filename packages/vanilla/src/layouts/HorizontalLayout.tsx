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
import { connect } from 'react-redux';
import {
    HorizontalLayout,
    mapStateToLayoutProps,
    RankedTester,
    rankWith,
    RendererProps,
    uiTypeIs,
} from '@jsonforms/core';
import { addVanillaLayoutProps } from '../util';
import { JsonFormsLayout } from './JsonFormsLayout';
import { renderChildren } from './util';
import { VanillaRendererProps } from '../index';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

const HorizontalLayoutRenderer = (props: RendererProps & VanillaRendererProps) => {

  const {
    schema,
    uischema,
    path,
    visible,
    getStyle,
    getStyleAsClassName,
  } = props;

  const horizontalLayout = uischema as HorizontalLayout;
  const elementsSize = horizontalLayout.elements ? horizontalLayout.elements.length : 0;
  const layoutClassName = getStyleAsClassName('horizontal.layout');
  const childClassNames = getStyle('horizontal.layout.item', elementsSize)
    .concat(['horizontal-layout-item'])
    .join(' ');

  return (
    <JsonFormsLayout
      className={layoutClassName}
      visible={visible}
      uischema={uischema}
      schema={schema}
      getStyle={getStyle}
      getStyleAsClassName={getStyleAsClassName}
    >
      {renderChildren(horizontalLayout, schema, childClassNames, path)}
    </JsonFormsLayout>
  );
};

const ConnectedHorizontalLayout = connect(
  addVanillaLayoutProps(mapStateToLayoutProps),
  null
)(HorizontalLayoutRenderer);

export default ConnectedHorizontalLayout;
