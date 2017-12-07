import * as React from 'react';
import {
  DispatchRenderer,
  HorizontalLayout,
  JsonSchema,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps,
  UISchemaElement,
  uiTypeIs
} from 'jsonforms-core';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import Grid from 'material-ui/Grid';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(2, uiTypeIs('HorizontalLayout'));

export const MaterialHorizontalLayoutRenderer = ({ schema, uischema, path, visible }: RendererProps) => {

  const horizontalLayout = uischema as HorizontalLayout;

  return (
    <Grid container>
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
