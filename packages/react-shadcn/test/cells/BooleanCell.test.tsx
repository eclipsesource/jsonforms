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
import BooleanCell, { booleanCellTester } from '../../src/cells/BooleanCell';
import { initCore, TestEmitter } from '../util';

const schema = { type: 'boolean' };
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/active',
};

describe('BooleanCell tester', () => {
  it('should fail with undefined uischema', () => {
    expect(booleanCellTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(booleanCellTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong uischema type', () => {
    expect(booleanCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  });

  it('should succeed with correct uischema and schema', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      booleanCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'boolean' },
          },
        },
        undefined
      )
    ).toBe(2);
  });
});

describe('BooleanCell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render checked when data is true', () => {
    const core = initCore(schema, uischema, { active: true });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    expect(checkbox.prop('aria-checked')).toBe(true);
  });

  it('should render unchecked when data is false', () => {
    const core = initCore(schema, uischema, { active: false });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    expect(checkbox.prop('aria-checked')).toBe(false);
  });

  it('should render unchecked when data is undefined', () => {
    const core = initCore(schema, uischema, { active: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    expect(checkbox.prop('aria-checked')).toBe(false);
  });

  it('should update to true when clicked', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { active: false });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    checkbox.simulate('click');
    expect(onChangeData.data.active).toBe(true);
  });

  it('should update to false when clicked', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, { active: true });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    checkbox.simulate('click');
    expect(onChangeData.data.active).toBe(false);
  });

  it('should be disabled when enabled is false', () => {
    const core = initCore(schema, uischema, { active: true });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <BooleanCell
          schema={schema}
          uischema={uischema}
          path='active'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    expect(checkbox.prop('disabled')).toBe(true);
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, { active: true });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <BooleanCell schema={schema} uischema={uischema} path='active' />
      </JsonFormsStateProvider>
    );

    const checkbox = wrapper.find('button[role="checkbox"]');
    expect(checkbox.prop('disabled')).toBeFalsy();
  });
});
