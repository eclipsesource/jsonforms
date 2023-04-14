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
import { ControlElement, HorizontalLayout, JsonSchema } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import IntegerCell, { integerCellTester } from '../../src/cells/IntegerCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const control: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const fixture = {
  data: { foo: 42 },
  schema: {
    type: 'integer',
    minimum: 5,
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

describe('Integer cell tester', () => {
  test('tester', () => {
    expect(integerCellTester(undefined, undefined, undefined)).toBe(-1);
    expect(integerCellTester(null, undefined, undefined)).toBe(-1);
    expect(integerCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(integerCellTester({ type: 'Control' }, undefined, undefined)).toBe(
      -1
    );

    const controlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      integerCellTester(
        controlElement,
        { type: 'object', properties: { foo: { type: 'string' } } },
        undefined
      )
    ).toBe(-1);
    expect(
      integerCellTester(
        controlElement,
        {
          type: 'object',
          properties: { foo: { type: 'string' }, bar: { type: 'integer' } },
        },
        undefined
      )
    ).toBe(-1);
    expect(
      integerCellTester(
        controlElement,
        { type: 'object', properties: { foo: { type: 'integer' } } },
        undefined
      )
    ).toBe(2);
  });
});

describe('Integer cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstIntegerCell: { type: 'integer', minimum: 5 },
        secondIntegerCell: { type: 'integer', minimum: 5 },
      },
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstIntegerCell',
      options: {
        focus: true,
      },
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondIntegerCell',
      options: {
        focus: true,
      },
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement],
    };
    const data = {
      firstIntegerCell: 10,
      secondIntegerCell: 12,
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(document.activeElement).not.toBe(inputs.at(0));
    expect(document.activeElement).toBe(inputs.at(1));
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true,
      },
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).toBe(input);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false,
      },
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.step).toBe('1');
    expect(input.value).toBe('42');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
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
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '13' } });
    expect(onChangeData.data.foo).toBe(13);
  });

  test('update via action', () => {
    const data = { foo: 13 };
    const core = initCore(fixture.schema, fixture.uischema, data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: 42 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  test('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
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

  test('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
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
        <IntegerCell
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
    expect(input.value).toBe('42');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 13 };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
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
    expect(input.value).toBe('42');
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
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
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('shows 0 instead of empty string', () => {
    const core = initCore(fixture.schema, fixture.uischema, { foo: 0 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <IntegerCell
          schema={fixture.schema}
          uischema={fixture.uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('0');
  });
});
