import * as React from 'react';
import {
  HorizontalLayout,
  JsonFormsLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  renderChildren,
  uiTypeIs,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { VanillaRendererProps } from '../index';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

export const HorizontalLayoutRenderer = (
  {
    schema,
    uischema,
    path,
    visible,
    getStyle,
    getStyleAsClassName
  }: VanillaRendererProps) => {

  const horizontalLayout = uischema as HorizontalLayout;
  const elementsSize = horizontalLayout.elements ? horizontalLayout.elements.length : 0;
  const layoutClassName = getStyleAsClassName('horizontal-layout');
  const childClassNames = getStyle(
    'horizontal-layout-item',
    elementsSize
  )
    .concat(['horizontal-layout-item'])
    .join(' ');

  return (
    <JsonFormsLayout
      className={layoutClassName}
      visible={visible}
    >
      {
        renderChildren(
          horizontalLayout,
          schema,
          childClassNames,
          path
        )
      }
    </JsonFormsLayout>
  );
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToLayoutProps)(HorizontalLayoutRenderer)
);
