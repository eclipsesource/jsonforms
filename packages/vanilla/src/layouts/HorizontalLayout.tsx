import * as React from 'react';
import {
  connectToJsonForms,
  HorizontalLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { addVanillaLayoutProps, renderChildren, VanillaRendererProps } from '../util';
import { JsonFormsLayout } from './JsonFormsLayout';

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
      {renderChildren(horizontalLayout, schema, childClassNames, path)}
    </JsonFormsLayout>
  );
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connectToJsonForms(
    addVanillaLayoutProps(mapStateToLayoutProps),
    null
  )(HorizontalLayoutRenderer)
);
