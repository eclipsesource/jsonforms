import { JSX } from '../JSX';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { HorizontalLayout } from '../../models/uischema';
import {
  JsonFormsLayout,
  mapStateToLayoutProps,
  registerStartupRenderer,
  renderChildren
} from '../renderer.util';
import { connect } from '../../common/binding';
import {RendererProps} from "../../core/renderer";

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
