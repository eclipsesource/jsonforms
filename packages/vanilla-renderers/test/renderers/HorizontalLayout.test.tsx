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
import { HorizontalLayout, UISchemaElement } from '@jsonforms/core';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester,
} from '../../src/layouts/HorizontalLayout';
import { initCore } from '../util';
import { JsonFormsStateProvider } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  uischema: {
    type: 'HorizontalLayout',
    elements: [{ type: 'Control' }],
  },
};

test('tester', () => {
  expect(horizontalLayoutTester(undefined, undefined, undefined)).toBe(-1);
  expect(horizontalLayoutTester(null, undefined, undefined)).toBe(-1);
  expect(horizontalLayoutTester({ type: 'Foo' }, undefined, undefined)).toBe(
    -1
  );
  expect(
    horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined, undefined)
  ).toBe(1);
});

describe('Horizontal layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'HorizontalLayout',
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const horizontalLayout = wrapper
      .find('JsonFormsLayout')
      .getDOMNode() as HTMLDivElement;

    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(0);
  });

  test('render with null elements', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: null,
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const horizontalLayout = wrapper.find('JsonFormsLayout').getDOMNode();
    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(0);
  });

  test('render with children', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [{ type: 'Control' }, { type: 'Control' }],
    };
    const core = initCore({}, uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const horizontalLayout = wrapper
      .find('JsonFormsLayout')
      .getDOMNode() as HTMLDivElement;
    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(2);
  });

  test('hide', () => {
    const core = initCore({}, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer uischema={fixture.uischema} visible={false} />
      </JsonFormsStateProvider>
    );
    const horizontalLayout = wrapper
      .find('JsonFormsLayout')
      .getDOMNode() as HTMLDivElement;
    expect(horizontalLayout.hidden).toBe(true);
  });

  test('show by default', () => {
    const core = initCore({}, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );
    const horizontalLayout = wrapper
      .find('JsonFormsLayout')
      .getDOMNode() as HTMLDivElement;
    expect(horizontalLayout.hidden).toBe(false);
  });
});
