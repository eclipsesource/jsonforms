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
import React, { Dispatch, ReducerAction } from 'react';
import {
  ControlElement,
  coreReducer,
  NOT_APPLICABLE,
  update
} from '@jsonforms/core';
import TimeCell, { materialTimeCellTester } from '../../src/cells/MaterialTimeCell';
import { act } from 'react-dom/test-utils';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsContext, JsonFormsStateContext, JsonFormsStateProvider } from '@jsonforms/react';
import { MuiInputTime } from '../../src/mui-controls/MuiInputTime';
import { resolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: '13:37' };

const schema = {
  type: 'string',
  format: 'time'
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material time cell tester', () => {
  it('should fail', async () => {
    expect(
      await materialTimeCellTester(undefined, undefined, resolveRef(undefined))
    ).toBe(NOT_APPLICABLE);
    expect(
      await materialTimeCellTester(null, undefined, resolveRef(undefined))
    ).toBe(NOT_APPLICABLE);
    expect(
      await materialTimeCellTester({ type: 'Foo' }, undefined, resolveRef(undefined))
    ).toBe(NOT_APPLICABLE);
    expect(
      await materialTimeCellTester({ type: 'Control' }, undefined, resolveRef(undefined))
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail with wrong prop type', async () => {
    const wrongSchema = {
      type: 'object',
      properties: {
        foo: { type: 'string' }
      }
    };
    expect(
      await materialTimeCellTester(uischema, wrongSchema, resolveRef(wrongSchema))).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling prop has correct type', async () => {
    const wrongSchema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: {
          type: 'string',
          format: 'time'
        }
      }
    };
    expect(await materialTimeCellTester(uischema, wrongSchema, resolveRef(wrongSchema))).toBe(NOT_APPLICABLE);
  });

  it('should succeed with correct prop type', async () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          format: 'time'
        }
      }
    };
    expect(await materialTimeCellTester(uischema, jsonSchema, resolveRef(jsonSchema))).toBe(2);
  });
});

describe('Material time cell', () => {
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
      <JsonFormsStateProvider initState={{ core: { schema, uischema: control, data } }}>
        <JsonFormsContext.Consumer>
          {() => (<TimeCell schema={schema} uischema={control} path='foo' />)}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
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
      <JsonFormsStateProvider initState={{ core: { schema, uischema: control, data } }}>
        <JsonFormsContext.Consumer>
          {() => (<TimeCell schema={schema} uischema={control} path='foo' />)}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema: control, data } }}>
        <JsonFormsContext.Consumer>
          {() => (<TimeCell schema={schema} uischema={control} path='foo' />)}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {() => (<TimeCell schema={schema} uischema={uischema} path='foo' />)}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('time');
    expect(input.props().value).toBe('13:37');
  });

  it('should update via event', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {() => (<TimeCell schema={schema} uischema={uischema} path='foo' />)}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    act(() => { input.simulate('change', { target: { value: '20:15' } }); });
    wrapper.update();
    expect(wrapper.find(MuiInputTime).props().data).toBe('20:15');
  });

  it('should update via action', () => {
    let dispatch: Dispatch<ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return (<TimeCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update('foo', () => '20:15')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('20:15');
  });

  it('should update with null value', () => {
    let dispatch: Dispatch<ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return (
              <TimeCell schema={schema} uischema={uischema} path='foo' />
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update('foo', () => null)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('update with undefined value', () => {
    let dispatch: Dispatch<ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return (
              <TimeCell schema={schema} uischema={uischema} path='foo' />
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update('foo', () => undefined)); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    let dispatch: React.Dispatch<React.ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }}>
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return (<TimeCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update('bar', () => 'Bar')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('13:37');
  });

  it('should update with null ref', () => {
    let dispatch: React.Dispatch<React.ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }} >
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return (<TimeCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update(null, () => '20:15')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('13:37');
  });

  it('should update with undefined ref', async () => {
    let dispatch: React.Dispatch<React.ReducerAction<typeof coreReducer>>;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema, data } }} >
        <JsonFormsContext.Consumer>
          {(ctx: JsonFormsStateContext) => {
            dispatch = ctx.dispatch;
            return <TimeCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    act(() => { dispatch(update(undefined, () => '20:15')); });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('13:37');
  });

  it('can be disabled', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema } }}>
        <TimeCell schema={schema} uischema={uischema} enabled={false} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { schema, uischema } }} >
        <TimeCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
