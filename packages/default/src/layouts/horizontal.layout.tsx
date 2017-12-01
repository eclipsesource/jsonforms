import * as React from 'react';
import {
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
  HorizontalLayout,
  renderChildren,
  JsonFormsLayout,
  mapStateToLayoutProps,
  registerStartupRenderer,
} from 'jsonforms-core';
import { connect } from 'react-redux';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

export const HorizontalLayoutRenderer = ({ schema, uischema, path, visible }: RendererProps) => {

  const horizontalLayout = uischema as HorizontalLayout;

  return (
    <JsonFormsLayout
      styleName='horizontal-layout'
      visible={visible}
    >
      {
        renderChildren(
          horizontalLayout.elements,
          schema,
          'horizontal-layout-item',
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
