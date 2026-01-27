/*
  The MIT License

  Copyright (c) 2017-2025 EclipseSource Munich
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

import React from 'react';
import { ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { mount, ReactWrapper } from 'enzyme';
import NumberCell, { numberCellTester } from '../../src/cells/NumberCell';
import { initCore, TestEmitter } from '../util';

const schema = { type: 'number' };
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/age',
};

describe('NumberCell tester', () => {
  it('should fail with undefined uischema', () => {
    expect(numberCellTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(numberCellTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      numberCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
        },
        undefined
      )
    ).toBe(-1);
  });

  it('should succeed with correct uischema and schema', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      numberCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'number' },
          },
        },
        undefined
      )
    ).toBe(2);
  });
});

describe('NumberCell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render with number data', () => {
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('25');
    expect(input.type).toBe('number');
  });

  it('should render with empty string when data is undefined', () => {
    const core = initCore(schema, uischema, { age: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should render with decimal numbers', () => {
    const core = initCore(schema, uischema, { age: 25.5 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('25.5');
  });

  it('should update via input event', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '30' } });
    expect(onChangeData.data.age).toBe(30);
  });

  it('should handle decimal input', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '25.5' } });
    expect(onChangeData.data.age).toBe(25.5);
  });

  it('should update with undefined when input is empty', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '' } });
    expect(onChangeData.data.age).toBeUndefined();
  });

  it('should be disabled when enabled is false', () => {
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell
          schema={schema}
          uischema={uischema}
          path='age'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  it('should handle negative numbers', () => {
    const core = initCore(schema, uischema, { age: -10 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('-10');
  });

  it('should have step attribute', () => {
    const core = initCore(schema, uischema, { age: 25 });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <NumberCell schema={schema} uischema={uischema} path='age' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.step).toBe('0.1');
  });
});
