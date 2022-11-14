/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import isEmpty from 'lodash/isEmpty';
import React, { FunctionComponent } from 'react';
import { GroupLayout, LayoutProps, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { renderChildren } from './util';
import { VanillaRendererProps } from '../index';
import { withVanillaControlProps } from '../util';

/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export const GroupLayoutRenderer = (props: LayoutProps & VanillaRendererProps) => {
  const {data, ...otherProps} = props;
  // We don't hand over data to the layout renderer to avoid rerendering it with every data change
  return <GroupLayoutRendererComponent {...otherProps}/>;
}

const GroupLayoutRendererComponent: FunctionComponent<LayoutProps & VanillaRendererProps> = React.memo((
  {
    schema,
    uischema,
    path,
    enabled,
    visible,
    label,
    getStyle,
    getStyleAsClassName
  }: LayoutProps & VanillaRendererProps) => {
  const group = uischema as GroupLayout;
  const elementsSize = group.elements ? group.elements.length : 0;
  const classNames = getStyleAsClassName('group.layout');
  const childClassNames = ['group-layout-item']
    .concat(getStyle('group.layout.item', elementsSize))
    .join(' ');

  return (
    <fieldset
      className={classNames}
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {
        !isEmpty(label) ?
          <legend className={getStyleAsClassName('group.label')}>
            {label}
          </legend> : ''
      }
      {renderChildren(group, schema, childClassNames, path, enabled)}
    </fieldset>
  );
});

export default withVanillaControlProps(withJsonFormsLayoutProps(GroupLayoutRenderer));
