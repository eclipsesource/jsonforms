import * as React from 'react';
import {
  connectToJsonForms,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs,
  VerticalLayout,
} from '@jsonforms/core';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const materialVerticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

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

export default connectToJsonForms(
  mapStateToLayoutProps
)(MaterialVerticalLayoutRenderer);