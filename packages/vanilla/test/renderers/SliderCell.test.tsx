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
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import SliderCell, { sliderCellTester } from '../../src/cells/SliderCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';

Enzyme.configure({ adapter: new Adapter() });

const controlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const fixture = {
  data: { 'foo': 5 },
  schema: {
    type: 'number',
    maximum: 10,
    minimum: 2,
    default: 6
  },
  uischema: controlElement,
  styles: [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]
};

describe('Slider cell tester', () => {
  test('tester', () => {
    expect(sliderCellTester(undefined, undefined)).toBe(-1);
    expect(sliderCellTester(null, undefined)).toBe(-1);
    expect(sliderCellTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(sliderCellTester({ type: 'Control' }, undefined)).toBe(-1);
  });

  test('tester with wrong schema type', () => {
    const control: ControlElement = fixture.uischema;
    expect(
      sliderCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with wrong schema type, but sibling has correct one', () => {
    const control: ControlElement = fixture.uischema;
    expect(
      sliderCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
            bar: { type: 'number' }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with correct schema type, but missing maximum and minimum cells', () => {
    const control: ControlElement = fixture.uischema;
    expect(
      sliderCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'number' }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with correct schema type, but missing maximum', () => {
    expect(
      sliderCellTester(
        fixture.uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              minimum: 2
            }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with correct schema type, but missing minimum', () => {
    expect(
      sliderCellTester(
        fixture.uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10
            }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with matching schema type (number) without default', () => {
    expect(
      sliderCellTester(
        fixture.uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2
            }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with matching schema type (integer) without default', () => {
    expect(
      sliderCellTester(
        fixture.uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
              maximum: 10,
              minimum: 2
            }
          }
        }
      )
    ).toBe(-1);
  });

  test('tester with matching schema type (number) with default', () => {
    const control: ControlElement = {
      ...fixture.uischema,
      options: { slider: true }
    };
    expect(
      sliderCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2,
              default: 3
            }
          }
        }
      )
    ).toBe(4);
  });

  test('tester with matching schema type (integer) with default', () => {
    const control: ControlElement = fixture.uischema;
    control.options = { slider: true };
    expect(
      sliderCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
              maximum: 10,
              minimum: 2,
              default: 4
            }
          }
        }
      )
    ).toBe(4);
  });
});

describe('Slider cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstSliderCell: { type: 'number', minimum: 5, maximum: 10 },
        secondSliderCell: { type: 'number', minimum: 5, maximum: 10 }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstSliderCell',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondSliderCell',
      options: {
        focus: true
      }
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement
      ]
    };
    const data = {
      firstSliderCell: 3.14,
      secondSliderCell: 5.12
    };
    const store = initJsonFormsVanillaStore({
      data,
      schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const inputs = wrapper.find('input');
    expect(document.activeElement).toBe(inputs.at(0).getDOMNode());
    expect(document.activeElement).toBe(inputs.at(1).getDOMNode());
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: { focus: true }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input');
    expect(document.activeElement).toBe(input.getDOMNode());
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: { focus: false }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6
        }
      }
    };
    const store = initJsonFormsVanillaStore({
      data: { 'foo': 5 },
      schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.value).toBe('5');
  });

  test('has classes set', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 3 } });
    wrapper.update();
    expect(getData(store.getState()).foo).toBe(3);
  });

  test('update via action', () => {
    const store = initJsonFormsVanillaStore({
      data: { 'foo': 3 },
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => 4));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('4');
  });
  // FIXME expect moves the slider and changes the value
  test.skip('update with undefined value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => undefined));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });
  // FIXME expect moves the slider and changes the value
  test.skip('update with null value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('foo', () => null));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('bar', () => 11));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  test('update with null ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update(null, () => 3));
    expect(input.value).toBe('5');
  });

  test('update with undefined ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(undefined, () => 13));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  test('disable', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
            enabled={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });
});
