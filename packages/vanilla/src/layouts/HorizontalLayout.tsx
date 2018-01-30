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
import { addVanillaLayoutProps } from '../util';
import { JsonFormsLayout } from './JsonFormsLayout';
import { VanillaLayoutProps } from '../index';
import { renderChildren } from './util';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

const HorizontalLayoutRenderer = (
  props: VanillaLayoutProps) => {

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

const ConnectedHorizontalLayout = connectToJsonForms(
  addVanillaLayoutProps(mapStateToLayoutProps),
  null
)(HorizontalLayoutRenderer);

registerStartupRenderer(horizontalLayoutTester, ConnectedHorizontalLayout);
export default ConnectedHorizontalLayout;
