import * as React from 'react';
import {
  HorizontalLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps,
  uiTypeIs
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(2, uiTypeIs('HorizontalLayout'));

export const MaterialHorizontalLayoutRenderer = (
  { schema, uischema, path, visible, config }: RendererProps) => {
  const horizontalLayout = uischema as HorizontalLayout;
  const childProps: MaterialLayoutRendererProps = {
    elements: horizontalLayout.elements,
    schema,
    path,
    direction: 'row',
    visible,
    config
  };

  return <MaterialLayoutRenderer {...childProps}/>;
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToLayoutProps)(MaterialHorizontalLayoutRenderer)
);
