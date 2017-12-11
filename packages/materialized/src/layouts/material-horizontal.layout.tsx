import * as React from 'react';
import {
  DispatchRenderer,
  HorizontalLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(2, uiTypeIs('HorizontalLayout'));

export const MaterialHorizontalLayoutRenderer = ({ schema, uischema, path, visible }: RendererProps) => {

  const horizontalLayout = uischema as HorizontalLayout;
  const className = !visible ? 'hidden' : '' ;

  return (
    <Grid container className={className}>
    {
      (horizontalLayout.elements || []).map((child, index) => {

        return (
          <Grid item key={`${path}-${index}`} xs>
            <DispatchRenderer
              uischema={child}
              schema={schema}
              path={path}
            />
          </Grid>
        );
      })
    }
    </Grid>
  );
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToLayoutProps)(MaterialHorizontalLayoutRenderer)
);
