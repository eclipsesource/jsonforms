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
  HorizontalLayout,
  JsonSchema,
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import SliderCell, { sliderCellTester } from '../../src/cells/SliderCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';

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
    expect(sliderCellTester(undefined, undefined, undefined)).toBe(-1);
    expect(sliderCellTester(null, undefined, undefined)).toBe(-1);
    expect(sliderCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(sliderCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
        },
        undefined
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
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
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
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
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
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
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
    const core = initCore(schema, fixture.uischema, { 'foo': 5 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.value).toBe('5');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const onChangeData: any = {
      data: undefined
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 3 } });
    wrapper.update();
    expect(onChangeData.data.foo).toBe(3);
  });

  test('update via action', () => {
    const core = initCore(fixture.schema, fixture.uischema, { 'foo': 3 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: 4 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('4');
  });
  // FIXME expect moves the slider and changes the value
  test.skip('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });
  // FIXME expect moves the slider and changes the value
  test.skip('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, null: 3 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('5');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 13 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <SliderCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });
});
