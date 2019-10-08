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
  NOT_APPLICABLE,
  update
} from '@jsonforms/core';
import { JsonFormsStateProvider, JsonFormsContext, JsonFormsStateContext } from '@jsonforms/react';
import MaterialDateCell, {
  materialDateCellTester
} from '../../src/cells/MaterialDateCell';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { resolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: '1980-06-04' };
const schema = {
  type: 'string',
  format: 'date'
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material date cell', () => {
  it('should fail', async () => {
    expect(await materialDateCellTester(undefined, undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialDateCellTester(null, undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialDateCellTester({ type: 'Foo' }, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(await materialDateCellTester({ type: 'Control' }, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    const wrongType = {
      type: 'object',
      properties: {
        foo: { type: 'string' }
      }
    };
    expect(
      await materialDateCellTester(
        uischema,
        wrongType,
        resolveRef(wrongType)
      )
    ).toBe(NOT_APPLICABLE);
    const wrongProp = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: {
          type: 'string',
          format: 'date'
        }
      }
    };
    expect(
      await materialDateCellTester(
        uischema,
        schema,
        resolveRef(wrongProp)
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', async () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          format: 'date'
        }
      }
    };
    expect(await materialDateCellTester(uischema, jsonSchema, resolveRef(jsonSchema))).toBe(2);
  });
});

describe('Material date cell', () => {
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
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <MaterialDateCell schema={schema} uischema={control} path='foo' />
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
      <JsonFormsStateProvider initState={{ core: { uischema: control, schema, data } }}>
        <MaterialDateCell schema={schema} uischema={control} path='foo' />
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
      <JsonFormsStateProvider initState={{ core: { uischema: control, schema, data } }}>
        <MaterialDateCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('date');
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should update via event', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: '1961-04-12' } });
    expect(ctx.core.data.foo).toBe('1961-04-12');
  });

  it('should update via action', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(update('foo', () => '1961-04-12'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1961-04-12');
  });

  it('should update with null value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(update('foo', () => null));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe('');
  });

  it('should update with undefined value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(update('foo', () => undefined));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    ctx.dispatch(update('bar', () => 'Bar'));
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should not update with null ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <MaterialDateCell schema={schema} uischema={uischema} path='foo' />
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(update(null, () => '1961-04-12'));
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should update with undefined ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<MaterialDateCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    ctx.dispatch(update(undefined, () => '1961-04-12'));
    expect(input.props().value).toBe('1980-06-04');
  });

  it('can be disabled', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <MaterialDateCell
          schema={schema}
          uischema={uischema}
          enabled={false}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <MaterialDateCell
          schema={schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
