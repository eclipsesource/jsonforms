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
import { JsonFormsStateProvider, JsonFormsDispatch } from '@jsonforms/react';
import { mount, ReactWrapper } from 'enzyme';
import { inputControlTester } from '../../src/controls/InputControl';
import { shadcnRenderers, shadcnCells } from '../../src';
import { initCore } from '../util';

const fixture = {
  data: { foo: true },
  schema: {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean',
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo',
  } as ControlElement,
};

describe('InputControl tester', () => {
  it('should fail with undefined uischema', () => {
    expect(inputControlTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(inputControlTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong uischema type', () => {
    expect(inputControlTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  });

  it('should succeed with control uischema', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(inputControlTester(control, undefined, undefined)).toBe(1);
  });
});

describe('InputControl', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('should render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('Field').exists()).toBe(true);
  });

  it('should render label', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean',
          title: 'Test Label',
        },
      },
    };
    const core = initCore(schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);
  });

  it('should render without label when label is false', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      label: false,
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const label = wrapper.find('label');
    expect(label.exists()).toBe(false);
  });

  it('should show required indicator when required', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
      },
      required: ['foo'],
    };
    const core = initCore(schema, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);
  });

  it('should be visible by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('Field').exists()).toBe(true);
  });

  it('should show description', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean',
          description: 'This is a description',
        },
      },
    };
    const core = initCore(schema, fixture.uischema, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const description = wrapper.find('FieldDescription');
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe('This is a description');
  });

  it('should show validation errors', () => {
    const core = initCore(fixture.schema, fixture.uischema, { foo: 'invalid' });
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ core, renderers: shadcnRenderers, cells: shadcnCells }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const error = wrapper.find('FieldError');
    expect(error.exists()).toBe(true);
  });
});
