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
import { UISchemaElement, VerticalLayout } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import VerticalLayoutRenderer, { verticalLayoutTester } from '../../src/layouts/VerticalLayout';
import { initCore } from '../util';

Enzyme.configure({ adapter: new Adapter() });

test('tester', () => {
  expect(verticalLayoutTester(undefined, undefined, undefined)).toBe(-1);
  expect(verticalLayoutTester(null, undefined, undefined)).toBe(-1);
  expect(verticalLayoutTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  expect(verticalLayoutTester({ type: 'VerticalLayout' }, undefined, undefined)).toBe(1);
});

describe('Vertical layout', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'VerticalLayout'
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('.vertical-layout')).toBeDefined();
  });

  test('render with null elements', () => {
    const uischema: VerticalLayout = {
      type: 'VerticalLayout',
      elements: null
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('.vertical-layout')).toBeDefined();
  });

  test('render with children', () => {
    const uischema: VerticalLayout = {
      type: 'VerticalLayout',
      elements: [{ type: 'Control' }, { type: 'Control' }]
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const verticalLayout = wrapper.find('JsonFormsLayout').getDOMNode();

    expect(verticalLayout.tagName).toBe('DIV');
    expect(verticalLayout.children).toHaveLength(2);
  });

  test('hide', () => {
    const uischema: VerticalLayout = {
      type: 'VerticalLayout',
      elements: [{ type: 'Control' }],
    };
    const core = initCore({}, uischema, {});

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayoutRenderer
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );
    const verticalLayout = wrapper.find('JsonFormsLayout').getDOMNode() as HTMLDivElement;
    expect(verticalLayout.hidden).toBe(true);
  });

  test('show by default', () => {
    const uischema: VerticalLayout = {
      type: 'VerticalLayout',
      elements: [{ type: 'Control' }],
    };
    const core = initCore({}, uischema, {});

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const verticalLayout = wrapper.find('JsonFormsLayout').getDOMNode() as HTMLDivElement;
    expect(verticalLayout.hidden).toBe(false);
  });
});
