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
import BooleanCell, { booleanCellTester } from '../../src/cells/BooleanCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';
import { vanillaRenderers } from '../../src';
import { InputControl } from '../../src/controls/InputControl';

Enzyme.configure({ adapter: new Adapter() });

const control: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const fixture = {
  data: { foo: true },
  schema: { type: 'boolean' },
  uischema: control,
  styles: [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.checkbox',
      classNames: ['checkbox']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]
};

describe('Boolean cell tester', () => {
  test('tester', () => {
    expect(booleanCellTester(undefined, undefined, undefined)).toBe(-1);
    expect(booleanCellTester(null, undefined, undefined)).toBe(-1);
    expect(booleanCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(booleanCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
  });

  test('tester with wrong prop type', () => {
    const controlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: { foo: { type: 'string' } }
      },
      undefined),
    ).toBe(-1);
  });

  test('tester with wrong prop type, but sibling has correct one', () => {
    const controlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'boolean'
          }
        }
      },
      undefined)
    ).toBe(-1);
  });

  test('tester with matching prop type', () => {
    const controlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: {
          foo: {
            type: 'boolean'
          }
        }
      },
      undefined)
    ).toBe(2);
  });

});

describe('Boolean cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstBooleanCell: { type: 'boolean' },
        secondBooleanCell: { type: 'boolean' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstBooleanCell',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondBooleanCell',
      options: {
        focus: true
      }
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement]
    };
    const data = {
      firstBooleanCell: true,
      secondBooleanCell: false
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find(InputControl);
    expect(inputs.at(0).is(':focus')).toBe(false);
    expect(inputs.at(1).is(':focus')).toBe(true);
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
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.is(':focus')).toBe(true);
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
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
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
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).not.toBe(input);
  });

  test('render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('checkbox');
    expect(input.checked).toBe(true);
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.hasClass('checkbox')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const onChangeData: any = {
      data: undefined
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { checked: false } });
    expect(onChangeData.data.foo).toBe(false);
  });

  test('update via action', () => {
    const data = { foo: false };
    const onChangeData: any = {
      data: undefined
    };
    const core = initCore(fixture.schema, fixture.uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, foo: false };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    expect(input.checked).toBe(false);
    expect(onChangeData.data.foo).toBe(false);
  });

  test.skip('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    expect(input.value).toEqual('');
  });

  test.skip('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    expect(input.value).toEqual('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    expect(input.props().checked).toBe(true);
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, null: false };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    expect(input.checked).toBe(true);
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: false };
    wrapper.setProps({ initState: { renderers: vanillaRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('with checkbox className', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.classList.contains('checkbox')).toBe(true);
  });
});
