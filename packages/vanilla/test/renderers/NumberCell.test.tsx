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
import NumberCell, { numberCellTester } from '../../src/cells/NumberCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const controlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const fixture = {
  data: { 'foo': 3.14 },
  schema: {
    type: 'number',
    minimum: 5
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

describe('Number cell tester', () => {
  test('tester', () => {
    expect(numberCellTester(undefined, undefined, undefined)).toBe(-1);
    expect(numberCellTester(null, undefined, undefined)).toBe(-1);
    expect(numberCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(numberCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
  });

  test('tester with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      numberCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            }
          }
        },
        undefined
      )
    ).toBe(-1);
  });

  test('tester with wrong schema type, but sibling has correct one', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      numberCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            },
            bar: {
              type: 'number'
            }
          }
        },
        undefined
      )
    ).toBe(-1);
  });

  test('tester with machting schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      numberCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number'
            }
          }
        },
        undefined
      )
    ).toBe(2);
  });
});

describe('Number cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstNumberCell: { type: 'number', minimum: 5 },
        secondNumberCell: { type: 'number', minimum: 5 }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstNumberCell',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondNumberCell',
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
      'firstNumberCell': 3.14,
      'secondNumberCell': 5.12
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const inputs = wrapper.find('input');
    expect(document.activeElement).toBe(inputs.at(0));
    expect(document.activeElement).toBe(inputs.at(1));
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const schema: JsonSchema = { type: 'number' };
    const core = initCore(schema, fixture.uischema, { 'foo': 3.14 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.step).toBe('0.1');
    expect(input.value).toBe('3.14');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
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
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '2.72' } });
    wrapper.update();
    expect(onChangeData.data.foo).toBe(2.72);
  });

  test('update via action', () => {
    const core = initCore(fixture.schema, fixture.uischema, { foo: 2.72 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('2.72');
    core.data = { ...core.data, foo: 3.14 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('3.14');
  });

  test('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('');
  });

  test('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('3.14');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, null: 2.72 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(input.value).toBe('3.14');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 13 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('3.14');
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('shows 0 instead of empty string', () => {
    const core = initCore(fixture.schema, fixture.uischema, { foo: 0 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('0');
  });
});
