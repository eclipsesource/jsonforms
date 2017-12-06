import { JSX } from '../JSX';
import * as _ from 'lodash';
import { JsonSchema } from '../../models/jsonSchema';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { HorizontalLayout, UISchemaElement } from '../../models/uischema';
import {
  JsonFormsLayout,
  mapStateToLayoutProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect } from '../../common/binding';
import { RendererProps } from '../../core/renderer';
import DispatchRenderer from '../dispatch-renderer';
import Grid  from 'material-ui/Grid';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(2, uiTypeIs('HorizontalLayout'));
const renderChildren = (
  elements: UISchemaElement[],
  schema: JsonSchema,
  path: string
) => {

  if (_.isEmpty(elements)) {
    return [];
  }

  return elements.map((child, index) => {

    return (
      <Grid item key={`${path}-${index}`}>
        <DispatchRenderer
          uischema={child}
          schema={schema}
          path={path}
        />
      </Grid>
    );
  });
};
export const MaterialHorizontalLayoutRenderer = ({ schema, uischema, path, visible }: RendererProps) => {

  const horizontalLayout = uischema as HorizontalLayout;

  return (
    <Grid container>
    {
      renderChildren(
        horizontalLayout.elements,
        schema,
        path
      )
    }
    </Grid>
  );
};

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToLayoutProps)(MaterialHorizontalLayoutRenderer)
);
