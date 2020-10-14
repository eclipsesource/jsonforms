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
import './MatchMediaMock';
import * as React from 'react';
import {
  ControlElement,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import NumberCell, {
  materialNumberCellTester
} from '../../src/cells/MaterialNumberCell';
import { materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 3.14 };
const schema = {
  type: 'number',
  minimum: 5
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material number cells tester', () => {
  it('should fail', () => {
    expect(materialNumberCellTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialNumberCellTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialNumberCellTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialNumberCellTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
  });

  it('should succeed with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'number'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with matching prop type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      materialNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          }
        }
      })
    ).toBe(2);
  });
});

describe('Material number cells', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number'
        }
      }
    };
    const core = initCore(schema, uischema, { foo: 3.14 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={jsonSchema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('0.1');
    expect(input.props().value).toBe(3.14);
  });

  it('should render 0', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number'
        }
      }
    };
    const core = initCore(schema, uischema, { foo: 0 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={jsonSchema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('0.1');
    expect(input.props().value).toBe(0);
  });

  it('should update via input event', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 2.72 } });
    expect(onChangeData.data.foo).toBe(2.72);
  });

  it('should update via action', () => {
    const core = initCore(schema, uischema, { foo: 2.72 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(2.72);

    core.data = { ...core.data, foo: 3.14 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();

    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe(3.14);
  });

  it('should update with undefined value', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with null value', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('should not update with null ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 2.72 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('should not update with undefined ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 13 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('can be disabled', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell
          schema={schema}
          uischema={uischema}
          path='foo'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
