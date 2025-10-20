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
import { ControlElement, NOT_APPLICABLE } from '@jsonforms/core';
import IntegerCell, {
  materialIntegerCellTester,
} from '../../src/cells/MaterialIntegerCell';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 42 };
const schema = {
  type: 'integer',
  minimum: 5,
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

describe('Material integer cells tester', () => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };

  it('should fail', () => {
    expect(materialIntegerCellTester(undefined, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialIntegerCellTester(null, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialIntegerCellTester({ type: 'Foo' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
    expect(
      materialIntegerCellTester({ type: 'Control' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
    expect(
      materialIntegerCellTester(
        controlElement,
        {
          type: 'object',
          properties: { foo: { type: 'string' } },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialIntegerCellTester(
        controlElement,
        {
          type: 'object',
          properties: { foo: { type: 'string' }, bar: { type: 'integer' } },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialIntegerCellTester(
        controlElement,
        {
          type: 'object',
          properties: { foo: { type: 'integer' } },
        },
        undefined
      )
    ).toBe(2);
  });
});

describe('Material integer cells', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true,
      },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={control} path='foo' />
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
        focus: false,
      },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('1');
    expect(input.props().value).toBe(42);
  });

  it('should render 0', () => {
    const core = initCore(schema, uischema, { foo: 0 });
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('1');
    expect(input.props().value).toBe(0);
  });

  it('should update via input event', (done) => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 13 } });
    setTimeout(() => {
      expect(onChangeData.data.foo).toBe(13);
      done();
    }, 1000);
  });

  it('should update via action', (done) => {
    const core = initCore(schema, uischema, { foo: 13 });
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: 42 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe(42);
      done();
    }, 1000);
  });

  it('should not update with undefined value', (done) => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input');
      expect(input.props().value).toBe('');
      done();
    }, 1000);
  });

  it('should not update with null value', (done) => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input').first();
      expect(input.props().value).toBe('');
      done();
    }, 1000);
  });

  it('should not update with wrong ref', (done) => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input');
      expect(input.props().value).toBe(42);
      done();
    }, 1000);
  });

  it('should not update with null ref', (done) => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 13 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input');
      expect(input.props().value).toBe(42);
      done();
    }, 1000);
  });

  it('should not update with undefined ref', (done) => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 13 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    setTimeout(() => {
      const input = wrapper.find('input');
      expect(input.props().value).toBe(42);
      done();
    }, 1000);
  });

  it('can be disabled', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell
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
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
