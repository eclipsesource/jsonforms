import * as React from 'react';
import {
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { mapStateToVanillaLayoutProps, renderChildren, VanillaRendererProps } from '../util';
import { JsonFormsLayout } from './JsonFormsLayout';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

export const VerticalLayoutRenderer  = (
  {
    schema,
    uischema,
    path,
    visible,
    getStyle,
    getStyleAsClassName
  }: VanillaRendererProps) => {

  const verticalLayout = uischema as VerticalLayout;
  const elementsSize = verticalLayout.elements ? verticalLayout.elements.length : 0;
  const layoutClassName = getStyleAsClassName('vertical-layout');
  const childClassNames = getStyle('vertical-layout-item', elementsSize)
    .concat(['vertical-layout-item'])
    .join(' ');

  return (
    <JsonFormsLayout
      className={layoutClassName}
      visible={visible}
    >
      {renderChildren(verticalLayout, schema, childClassNames, path)}
    </JsonFormsLayout>
  );
};

export default registerStartupRenderer(
  verticalLayoutTester,
  connect(mapStateToVanillaLayoutProps)(VerticalLayoutRenderer)
);
