import { JSX } from '../JSX';
import * as _ from 'lodash';
import { JsonForms } from '../../core';
import { Renderer, RendererProps } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { GroupLayout } from '../../models/uischema';
import {JsonFormsLayout, mapStateToLayoutProps, registerStartupRenderer, renderChildren} from '../renderer.util';
import { connect } from 'inferno-redux';

/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export class GroupLayoutRenderer extends Renderer<RendererProps, void> {

  render() {
    const { schema, uischema, path, visible } = this.props;
    const group = uischema as GroupLayout;

    return (
      <JsonFormsLayout
        styleName='group-layout'
        visible={visible}
      >
        {
          !_.isEmpty(group.label) ?
            <legend className={JsonForms.stylingRegistry.getAsClassName('group.label')}>
              {group.label}
            </legend> : ''
        }
        {
          renderChildren(
            group.elements,
            schema,
            'group-layout-item',
            path
          )
        }
      </JsonFormsLayout>
    );
  }
}
export default registerStartupRenderer(
  groupTester,
  connect(mapStateToLayoutProps)(GroupLayoutRenderer)
);
