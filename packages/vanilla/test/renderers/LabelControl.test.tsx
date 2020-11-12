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
import { LabelElement, UISchemaElement } from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import LabelRenderer, {
  labelRendererTester
} from '../../src/complex/LabelRenderer';
import { initJsonFormsVanillaStore } from '../vanillaStore';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  data: { name: 'Foo' },
  schema: {
    type: 'object',
    properties: { name: { type: 'string' } }
  },
  uischema: { type: 'Label', text: 'Bar' },
  styles: [
    {
      name: 'label-control',
      classNames: ['jsf-label']
    }
  ]
};

describe('Label tester', () => {
  test('tester', () => {
    expect(labelRendererTester(undefined, undefined)).toBe(-1);
    expect(labelRendererTester(null, undefined)).toBe(-1);
    expect(labelRendererTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(labelRendererTester({ type: 'Label' }, undefined)).toBe(1);
  });
});

describe('Label', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render with undefined text', () => {
    const uischema: UISchemaElement = { type: 'Label' };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <LabelRenderer
            schema={fixture.schema}
            uischema={uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const label = wrapper.find('label').getDOMNode();
    expect(label.className).toBe('jsf-label');
    expect(label.textContent).toBe('');
  });

  test('render with null text', () => {
    const uischema: LabelElement = {
      type: 'Label',
      text: null
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
      styles: fixture.styles
    });

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <LabelRenderer
            schema={fixture.schema}
            uischema={uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').getDOMNode();
    expect(label.className).toBe('jsf-label');
    expect(label.textContent).toBe('');
  });

  test('render with text', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
      styles: fixture.styles
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <LabelRenderer
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').getDOMNode();
    expect(label.className).toBe('jsf-label');
    expect(label.childNodes).toHaveLength(1);
    expect(label.textContent).toBe('Bar');
  });

  test('hide', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <LabelRenderer
            schema={fixture.schema}
            uischema={fixture.uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').getDOMNode() as HTMLLabelElement;
    expect(label.hidden).toBe(true);
  });

  test('show by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <LabelRenderer
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').getDOMNode() as HTMLLabelElement;
    expect(label.hidden).toBe(false);
  });
});
