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
import {
  HorizontalLayout,
  UISchemaElement
} from '@jsonforms/core';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester
} from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  uischema: {
    type: 'HorizontalLayout',
    elements: [{ type: 'Control' }]
  },
  styles: [
    {
      name: 'horizontal.layout',
      classNames: ['horizontal-layout']
    }
  ]
};

test('tester', () => {
  expect(horizontalLayoutTester(undefined, undefined)).toBe(-1);
  expect(horizontalLayoutTester(null, undefined)).toBe(-1);
  expect(horizontalLayoutTester({ type: 'Foo' }, undefined)).toBe(-1);
  expect(horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined)).toBe(1);
});

describe('Horizontal layout', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'HorizontalLayout'
    };
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: {},
      uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const horizontalLayout = wrapper.find(HorizontalLayoutRenderer).getDOMNode() as HTMLDivElement;

    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(0);
  });

  test('render with null elements', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: null
    };
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: {},
      uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const horizontalLayout = wrapper.find(HorizontalLayoutRenderer).getDOMNode() as HTMLDivElement;
    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(0);
  });

  test('render with children', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control' },
        { type: 'Control' }
      ]
    };
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: {},
      uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const horizontalLayout = wrapper.find(HorizontalLayoutRenderer).getDOMNode() as HTMLDivElement;
    expect(horizontalLayout).toBeDefined();
    expect(horizontalLayout.children).toHaveLength(2);
  });

  test('hide', () => {
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: {},
      uischema: fixture.uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer
            uischema={fixture.uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const horizontalLayout = wrapper.find(HorizontalLayoutRenderer).getDOMNode() as HTMLDivElement;
    expect(horizontalLayout.hidden).toBe(true);
  });

  test('show by default', () => {
    const store = initJsonFormsVanillaStore({
      data: {},
      schema: {},
      uischema: fixture.uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer uischema={fixture.uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const horizontalLayout = wrapper.find(HorizontalLayoutRenderer).getDOMNode() as HTMLDivElement;
    expect(horizontalLayout.hidden).toBe(false);
  });
});
