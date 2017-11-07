import { JSX } from '../JSX';
import { Renderer, RendererProps } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { HorizontalLayout } from '../../models/uischema';
import {JsonFormsLayout, mapStateToLayoutProps, registerStartupRenderer, renderChildren} from '../renderer.util';
import { JsonForms } from '../../core';
import { connect } from 'inferno-redux';
/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

export class HorizontalLayoutRenderer extends Renderer<RendererProps, void> {

  /**
   * @inheritDoc
   */
  render() {
    const { schema, uischema, path, visible } = this.props;
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
  }
}

export default registerStartupRenderer(
  horizontalLayoutTester,
  connect(mapStateToLayoutProps)(HorizontalLayoutRenderer)
);
