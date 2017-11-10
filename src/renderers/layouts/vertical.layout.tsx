import { JSX } from '../JSX';
import { RendererProps } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { VerticalLayout } from '../../models/uischema';
import {
  JsonFormsLayout,
  mapStateToLayoutProps,
  registerStartupRenderer,
  renderChildren
} from '../renderer.util';
import { connect } from '../../common/binding';

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
