import * as React from 'react';
import * as _ from 'lodash';
import {
  connectToJsonForms,
  GroupLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { addVanillaLayoutProps, renderChildren, VanillaRendererProps } from '../util';

/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export const GroupLayoutRenderer = (
  {
    schema,
    uischema,
    path,
    visible,
    getStyle,
    getStyleAsClassName
  }: VanillaRendererProps) => {
  const group = uischema as GroupLayout;
  const elementsSize = group.elements ? group.elements.length : 0;
  const classNames = getStyleAsClassName('group-layout');
  const childClassNames = getStyle('group-layout-item', elementsSize)
    .concat(['group-layout-item'])
    .join(' ');

  return (
    <fieldset
      className={classNames}
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {
        !_.isEmpty(group.label) ?
          <legend className={getStyleAsClassName('group.label')}>
            {group.label}
          </legend> : ''
      }
      {renderChildren(group, schema, childClassNames, path)}
    </fieldset>
  );
};

export default registerStartupRenderer(
  groupTester,
  connectToJsonForms(
    addVanillaLayoutProps(mapStateToLayoutProps),
    null
  )(GroupLayoutRenderer)
);
