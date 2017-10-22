import { JSX } from '../JSX';
import { Renderer, RendererProps } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { VerticalLayout } from '../../models/uischema';
import { JsonFormsLayout, mapStateToLayoutProps, renderChildren } from '../renderer.util';
import { JsonForms } from '../../core';
import { connect } from 'inferno-redux';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

export class VerticalLayoutRenderer extends Renderer<RendererProps, void> {

  /**
   * @inheritDoc
   */
  render() {
    const { schema, uischema, path, visible } = this.props;
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
  }
}

export default JsonForms.rendererService.registerRenderer(
  verticalLayoutTester,
  connect(mapStateToLayoutProps)(VerticalLayoutRenderer)
);
