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
  NOT_APPLICABLE,
  update,
} from '@jsonforms/core';
import { act } from 'react-dom/test-utils';
import TextCell, { materialTextCellTester, } from '../../src/cells/MaterialTextCell';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsContext, JsonFormsStateContext, JsonFormsStateProvider, } from '@jsonforms/react';
import { resolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const DEFAULT_MAX_LENGTH = 524288;
const DEFAULT_SIZE = 20;

const data = { 'name': 'Foo' };
const minLengthSchema = {
  type: 'string',
  minLength: 3
};
const maxLengthSchema = {
  type: 'string',
  maxLength: 5
};
const schema = { type: 'string' };

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};

describe('Material text cell tester', () => {
  it('should fail', async () => {
    expect(await materialTextCellTester(undefined, undefined, resolveRef)).toBe(NOT_APPLICABLE);
    expect(await materialTextCellTester(null, undefined, resolveRef)).toBe(NOT_APPLICABLE);
    expect(await materialTextCellTester({ type: 'Foo' }, undefined, resolveRef)).toBe(NOT_APPLICABLE);
    expect(await materialTextCellTester({ type: 'Control' }, undefined, resolveRef)).toBe(NOT_APPLICABLE);
  });
  it('should fail with wrong schema type', async () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      await
        materialTextCellTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number'
              }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct type', async () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      await
        materialTextCellTester(
          control,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number'
              },
              bar: {
                type: 'string'
              }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
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
          type: 'string'
        }
      }
    };
    expect(await materialTextCellTester(control, jsonSchema, resolveRef(jsonSchema))).toBe(1);
  });
});

describe('Material text cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema: control } }}>
        <TextCell
          schema={minLengthSchema}
          uischema={control}
          path='name'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema: control } }}>
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema: control } }}>
        <TextCell schema={minLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(document.activeElement).not.toBe(input);
  });

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: jsonSchema, uischema } }}>
        <TextCell schema={jsonSchema} uischema={uischema} path={'name'} />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should update via input event', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider >
    );

    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: 'Bar' } });
    expect(ctx.core.data.name).toBe('Bar');
  });

  it('should update via action', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update('name', () => 'Bar')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Bar');
  });

  it('should update with undefined value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update('name', () => undefined)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should update with null value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update('name', () => null)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update if wrong ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update('firstname', () => 'Bar')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should not update if null ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update(null, () => 'Bar')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('should not update if undefined ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<TextCell schema={minLengthSchema} uischema={uischema} path='name' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { ctx.dispatch(update(undefined, () => 'Bar')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('Foo');
  });

  it('can be disabled', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <TextCell schema={minLengthSchema} uischema={uischema} path='name' enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: minLengthSchema, uischema } }}>
        <TextCell
          schema={minLengthSchema}
          uischema={uischema}
          path='name'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should use maxLength for size and maxlength attributes', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().maxLength).toBe(5);
    expect(input.parent().props().width).not.toBe('100%');
    expect(input.props().size).toBe(5);
  });

  it('should use maxLength for size attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).not.toBe('100%');
    expect(input.size).toBe(5);
  });

  it('should use maxLength for maxlength attribute', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should not use maxLength by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for trim and restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell
          schema={schema}
          uischema={control}
          path='name'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have a default value for trim', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { trim: true }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for restrict', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema: maxLengthSchema, uischema } }}>
        <TextCell
          schema={schema}
          uischema={control}
          path='name'
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });

  it('should have default values for attributes', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <TextCell
          schema={schema}
          uischema={uischema}
          path='name'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first().getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(DEFAULT_MAX_LENGTH);
    expect(
      getComputedStyle(input.parentElement, null).getPropertyValue('width')
    ).toBe('100%');
    expect(input.size).toBe(DEFAULT_SIZE);
  });
});
