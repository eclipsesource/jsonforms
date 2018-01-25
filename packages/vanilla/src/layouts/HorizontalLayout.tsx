import * as React from 'react';
import {
  HorizontalLayout,
  JsonFormsLayout,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { mapStateToVanillaLayoutProps, renderChildren, VanillaRendererProps } from '../util';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

const HorizontalLayoutRenderer = (
  props: VanillaRendererProps) => {

  const {
    schema,
    uischema,
    path,
    config,
    visible,
    getStyle,
    getStyleAsClassName,
  } = props;

  const horizontalLayout = uischema as HorizontalLayout;
  const elementsSize = horizontalLayout.elements ? horizontalLayout.elements.length : 0;
  const layoutClassName = getStyleAsClassName('horizontal-layout');
  const childClassNames = getStyle('horizontal-layout-item', elementsSize)
    .concat(['horizontal-layout-item'])
    .join(' ');

  return (
    <JsonFormsLayout
      className={layoutClassName}
      visible={visible}
    >
      {renderChildren(horizontalLayout, schema, childClassNames, path, config)}
    </JsonFormsLayout>
  );
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToVanillaLayoutProps, null)(HorizontalLayoutRenderer)
);
