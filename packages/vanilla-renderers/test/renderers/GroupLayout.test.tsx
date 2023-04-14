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
import * as React from 'react';
import { GroupLayout } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import GroupLayoutRenderer, {
  groupTester,
} from '../../src/layouts/GroupLayout';
import { initCore } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  uischema: {
    type: 'Group',
    elements: [{ type: 'Control' }],
  },
};

test('tester', () => {
  expect(groupTester(undefined, undefined, undefined)).toBe(-1);
  expect(groupTester(null, undefined, undefined)).toBe(-1);
  expect(groupTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  expect(groupTester({ type: 'Group' }, undefined, undefined)).toBe(1);
});

describe('Group layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render with label', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      label: 'Foo',
      elements: [],
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const groupLayout = wrapper.find('.group-layout').getDOMNode();
    const legend = groupLayout.children[0];

    expect(groupLayout.tagName).toBe('FIELDSET');
    expect(groupLayout.className).toBe('group-layout');
    expect(groupLayout.children).toHaveLength(1);
    expect(legend.tagName).toBe('LEGEND');
    expect(legend.textContent).toBe('Foo');
  });

  test('render with null elements', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: null,
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const groupLayout = wrapper.find('.group-layout').getDOMNode();
    expect(groupLayout.tagName).toBe('FIELDSET');
    expect(groupLayout.children).toHaveLength(0);
  });

  test('render with children', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [{ type: 'Control' }, { type: 'Control' }],
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const groupLayout = wrapper.find('.group-layout').getDOMNode();
    expect(groupLayout.tagName).toBe('FIELDSET');
    expect(groupLayout.children).toHaveLength(2);
  });

  test('hide', () => {
    const core = initCore({}, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={fixture.uischema} visible={false} />
      </JsonFormsStateProvider>
    );
    const groupLayout = wrapper.find('.group-layout');
    expect(groupLayout.props().hidden).toBe(true);
  });

  test('pass enabled prop to children', () => {
    const core = initCore({}, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={fixture.uischema} enabled={false} />
      </JsonFormsStateProvider>
    );
    const child = wrapper.find('JsonFormsDispatchRenderer');
    expect(child.prop('enabled')).toBe(false);
  });

  test('show by default', () => {
    const core = initCore({}, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <GroupLayoutRenderer uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );
    const groupLayout = wrapper.find('.group-layout');
    expect(groupLayout.props().hidden).toBe(false);
  });
});
