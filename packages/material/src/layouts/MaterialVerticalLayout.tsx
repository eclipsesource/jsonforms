import * as React from 'react';
import {
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

export const MaterialVerticalLayoutRenderer  = (
  { schema, uischema, path, visible }: RendererProps) => {
  const verticalLayout = uischema as VerticalLayout;
  const childProps: MaterialLayoutRendererProps = {
    elements: verticalLayout.elements,
    schema,
    path,
    direction: 'column',
    visible
  };

  return <MaterialLayoutRenderer {...childProps}/>;
};

const ConnectedMaterialLayoutRenderer = connect(
  mapStateToLayoutProps
)(MaterialVerticalLayoutRenderer);
registerStartupRenderer(verticalLayoutTester, ConnectedMaterialLayoutRenderer);
export default ConnectedMaterialLayoutRenderer;