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
import React, { FunctionComponent } from 'react';
import {
  HorizontalLayout,
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { withVanillaControlProps } from '../util';
import { JsonFormsLayout } from './JsonFormsLayout';
import { renderChildren } from './util';
import { VanillaRendererProps } from '../index';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(
  1,
  uiTypeIs('HorizontalLayout')
);

export const HorizontalLayoutRenderer = (
  props: RendererProps & VanillaRendererProps
) => {
  const { data: _data, ...otherProps } = props;
  // We don't hand over data to the layout renderer to avoid rerendering it with every data change
  return <HorizontalLayoutRendererComponent {...otherProps} />;
};

const HorizontalLayoutRendererComponent: FunctionComponent<
  RendererProps & VanillaRendererProps
> = React.memo(function HorizontalLayoutRendererComponent({
  schema,
  uischema,
  getStyle,
  getStyleAsClassName,
  enabled,
  visible,
  path,
}: RendererProps & VanillaRendererProps) {
  const horizontalLayout = uischema as HorizontalLayout;
  const elementsSize = horizontalLayout.elements
    ? horizontalLayout.elements.length
    : 0;
  const layoutClassName = getStyleAsClassName('horizontal.layout');
  const childClassNames = ['horizontal-layout-item']
    .concat(getStyle('horizontal.layout.item', elementsSize))
    .join(' ');

  return (
    <JsonFormsLayout
      className={layoutClassName}
      visible={visible}
      enabled={enabled}
      path={path}
      uischema={uischema}
      schema={schema}
      getStyle={getStyle}
      getStyleAsClassName={getStyleAsClassName}
    >
      {renderChildren(horizontalLayout, schema, childClassNames, path, enabled)}
    </JsonFormsLayout>
  );
});

export default withVanillaControlProps(
  withJsonFormsLayoutProps(HorizontalLayoutRenderer, false)
);
