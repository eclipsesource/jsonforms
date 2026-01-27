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
import EnumCell, { enumCellTester } from '../../src/cells/EnumCell';
import { initCore, TestEmitter } from '../util';

const schema = {
  type: 'string',
  enum: ['One', 'Two', 'Three'],
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/choice',
};

describe('EnumCell tester', () => {
  it('should fail with undefined uischema', () => {
    expect(enumCellTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(enumCellTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      enumCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'boolean' },
          },
        },
        undefined
      )
    ).toBe(-1);
  });

  it('should succeed with enum schema', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      enumCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
              enum: ['a', 'b', 'c'],
            },
          },
        },
        undefined
      )
    ).toBe(2);
  });
});

describe('EnumCell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render select with enum options', () => {
    const core = initCore(schema, uischema, { choice: 'One' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);

    const options = wrapper.find('option');
    // Should have 4 options: empty + 3 enum values
    expect(options.length).toBe(4);
  });

  it('should render with selected value', () => {
    const core = initCore(schema, uischema, { choice: 'Two' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.value).toBe('Two');
  });

  it('should render with empty value when data is undefined', () => {
    const core = initCore(schema, uischema, { choice: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.value).toBe('');
  });

  it('should have a none option', () => {
    const core = initCore(schema, uischema, { choice: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const options = wrapper.find('option');
    const firstOption = options.at(0);
    expect(firstOption.prop('value')).toBe('');
  });

  it('should update via change event', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { choice: 'One' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select');
    select.simulate('change', {
      target: { value: 'Three', selectedIndex: 3 },
    });
    expect(onChangeData.data.choice).toBe('Three');
  });

  it('should update to undefined when none option is selected', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { choice: 'Two' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select');
    select.simulate('change', {
      target: { value: '', selectedIndex: 0 },
    });
    expect(onChangeData.data.choice).toBeUndefined();
  });

  it('should be disabled when enabled is false', () => {
    const core = initCore(schema, uischema, { choice: 'One' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell
          schema={schema}
          uischema={uischema}
          path='choice'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, { choice: 'One' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <EnumCell schema={schema} uischema={uischema} path='choice' />
      </JsonFormsStateProvider>
    );

    const select = wrapper.find('select').getDOMNode() as HTMLSelectElement;
    expect(select.disabled).toBe(false);
  });
});
