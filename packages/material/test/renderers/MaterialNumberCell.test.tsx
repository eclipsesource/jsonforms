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
  Actions,
  ControlElement,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import NumberCell, { materialNumberCellTester } from '../../src/cells/MaterialNumberCell';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsContext, JsonFormsStateContext, JsonFormsStateProvider } from '@jsonforms/react';
import { act } from 'react-dom/test-utils';
import { resolveRef } from '../util';

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
  it('should fail', async () => {
    expect(await materialNumberCellTester(undefined, undefined, resolveRef(undefined))).toBe(NOT_APPLICABLE);
    expect(await materialNumberCellTester(null, undefined, resolveRef(undefined))).toBe(NOT_APPLICABLE);
    expect(await materialNumberCellTester({ type: 'Foo' }, undefined, resolveRef(undefined))).toBe(
      NOT_APPLICABLE
    );
    expect(await materialNumberCellTester({ type: 'Control' }, undefined, resolveRef(undefined))).toBe(
      NOT_APPLICABLE
    );
  });

  it('should succeed with wrong schema type', async () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const wrongType = {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    };
    expect(await materialNumberCellTester(control, wrongType, resolveRef(wrongType))).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', async () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const wrongProp = {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        },
        bar: {
          type: 'number'
        }
      }
    };
    expect(await materialNumberCellTester(control, wrongProp, resolveRef(wrongProp))).toBe(NOT_APPLICABLE);
  });

  it('should succeed with matching prop type', async () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const jsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number'
        }
      }
    };
    expect(await materialNumberCellTester(control, jsonSchema, resolveRef(jsonSchema))).toBe(2);
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
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, control } }}>
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
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, control } }}>
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
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, control } }}>
        <NumberCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider >
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
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 3.14 } }, schema, uischema }}>
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
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 0 } }, schema, uischema }}>
        <NumberCell schema={jsonSchema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('0.1');
    expect(input.props().value).toBe(0);
  });

  it('should update via input event', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 2.72 } });
    expect(ctx.core.data.foo).toBe(2.72);
  });

  it('should update via action', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 2.72 } }, schema, uischema }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider >
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(2.72);
    act(() => { ctx.dispatch(Actions.update('foo', () => 3.14)); });
    wrapper.update();
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe(3.14);
  });

  it('should update with undefined value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(Actions.update('foo', () => undefined)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with null value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </ JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(Actions.update('foo', () => null)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </ JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(Actions.update('bar', () => 11)); });
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('should not update with null ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(Actions.update(null, () => 2.72)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('should not update with undefined ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<NumberCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(Actions.update(undefined, () => 13)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(3.14);
  });

  it('can be disabled', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <NumberCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
