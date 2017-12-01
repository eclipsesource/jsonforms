import * as React from 'react';
import {
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
  VerticalLayout,
  renderChildren,
  JsonFormsLayout,
  mapStateToLayoutProps,
  registerStartupRenderer,
} from 'jsonforms-core';
import { connect } from 'react-redux';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

export const VerticalLayoutRenderer  = ({ schema, uischema, path, visible }: RendererProps) => {
  const verticalLayout = uischema as VerticalLayout;

  return (
    <JsonFormsLayout
      styleName='vertical-layout'
      visible={visible}
    >
      {
        renderChildren(
          verticalLayout.elements,
          schema,
          'vertical-layout-item',
          path
        )
      }
    </JsonFormsLayout>
  );
};

export default registerStartupRenderer(
  verticalLayoutTester,
  connect(mapStateToLayoutProps)(VerticalLayoutRenderer)
);
