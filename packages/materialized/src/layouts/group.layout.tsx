import * as React from 'react';
import * as _ from 'lodash';
import {
  GroupLayout,
  JsonForms,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  renderChildren,
  RendererProps,
  uiTypeIs,
} from 'jsonforms-core';
import { connect } from 'react-redux';

/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export const GroupLayoutRenderer = ({ schema, uischema, path, visible }: RendererProps) => {
  const group = uischema as GroupLayout;

  const classNames = JsonForms.stylingRegistry.getAsClassName('group-layout');

  return (
    <fieldset className={classNames}
         hidden={visible === undefined || visible === null ? false : !visible}
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
    </fieldset>
  );
};

export default registerStartupRenderer(
  groupTester,
  connect(mapStateToLayoutProps)(GroupLayoutRenderer)
);
