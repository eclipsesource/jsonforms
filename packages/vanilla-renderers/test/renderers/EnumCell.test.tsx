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
import { ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import EnumCell, { enumCellTester } from '../../src/cells/EnumCell';
import { initCore, TestEmitter } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const control: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const fixture = {
  data: { foo: 'a' },
  schema: {
    type: 'string',
    enum: ['a', 'b'],
  },
  uischema: control,
  styles: [
    {
      name: 'control',
      classNames: ['control'],
    },
    {
      name: 'control.validation',
      classNames: ['validation'],
    },
  ],
};

test('tester', () => {
  expect(enumCellTester(undefined, undefined, undefined)).toBe(-1);
  expect(enumCellTester(null, undefined, undefined)).toBe(-1);
  expect(enumCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  expect(enumCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
});

test('tester with wrong prop type', () => {
  expect(
    enumCellTester(
      fixture.uischema,
      { type: 'object', properties: { foo: { type: 'string' } } },
      undefined
    )
  ).toBe(-1);
});

test('tester with wrong prop type, but sibling has correct one', () => {
  expect(
    enumCellTester(
      fixture.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'string',
            enum: ['a', 'b'],
          },
        },
      },
      undefined
    )
  ).toBe(-1);
});

test('tester with matching string type', () => {
  expect(
    enumCellTester(
      fixture.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            enum: ['a', 'b'],
          },
        },
      },
      undefined
    )
  ).toBe(2);
});

test('tester with matching numeric type', () => {
  // TODO should expect be true?
  expect(
    enumCellTester(
      fixture.uischema,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            enum: [1, 2],
          },
        },
      },
      undefined
    )
  ).toBe(2);
});

describe('Enum cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    expect(select.value).toBe('a');
    expect(select.options).toHaveLength(3);
    expect(select.options.item(0).value).toBe('');
    expect(select.options.item(1).value).toBe('a');
    expect(select.options.item(2).value).toBe('b');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('select');
    expect(input.hasClass('select')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select');
    select.simulate('change', { target: { value: 'b' } });
    expect(onChangeData.data.foo).toBe('b');
  });

  test('empty selection should lead to data deletion', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    expect(onChangeData.data.foo).toBe('a');
    const select = wrapper.find('select');
    select.simulate('change', { target: { selectedIndex: 0 } });
    expect(onChangeData.data.foo).toBe(undefined);
  });

  test('update via action', () => {
    const data = { foo: 'b' };
    const core = initCore(fixture.schema, fixture.uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    core.data = { ...core.data, foo: 'b' };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(select.value).toBe('b');
    expect(select.selectedIndex).toBe(2);
  });

  test('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(select.selectedIndex).toBe(0);
    expect(select.value).toBe('');
  });

  test('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(select.selectedIndex).toBe(0);
    expect(select.value).toBe('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 'Bar' };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.selectedIndex).toBe(1);
    expect(select.value).toBe('a');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: false };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.selectedIndex).toBe(1);
    expect(select.value).toBe('a');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: false };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.selectedIndex).toBe(1);
    expect(select.value).toBe('a');
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select');
    expect(select.props().disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const select = wrapper.find('select');
    expect(select.props().disabled).toBe(false);
  });
});
