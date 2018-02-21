import * as React from 'react';
import * as _ from 'lodash';
import {
  GroupLayout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { addVanillaLayoutProps } from '../util';
import { connectToJsonForms } from '@jsonforms/react';
import { VanillaLayoutProps } from '../index';
import { renderChildren } from './util';

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
  }: VanillaLayoutProps) => {
  const group = uischema as GroupLayout;
  const elementsSize = group.elements ? group.elements.length : 0;
  const classNames = getStyleAsClassName('group.layout');
  const childClassNames = getStyle('group.layout.item', elementsSize)
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

const ConnectedGroupLayout =  connectToJsonForms(
  addVanillaLayoutProps(mapStateToLayoutProps),
  null
)(GroupLayoutRenderer);

export default ConnectedGroupLayout;
