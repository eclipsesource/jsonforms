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
import { VerticalLayout as VerticalLayoutSchema, ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { mount, ReactWrapper } from 'enzyme';
import { VerticalLayout, verticalLayoutTester } from '../../src/layouts/VerticalLayout';
import { initCore } from '../util';

const fixture = {
  data: { foo: 'test', bar: 42 },
  schema: {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'number' },
    },
  },
};

describe('VerticalLayout tester', () => {
  it('should fail with undefined uischema', () => {
    expect(verticalLayoutTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(verticalLayoutTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong uischema type', () => {
    expect(verticalLayoutTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  });

  it('should succeed with VerticalLayout uischema', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [],
    };
    expect(verticalLayoutTester(uischema, undefined, undefined)).toBe(1);
  });
});

describe('VerticalLayout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('should render', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayout
          schema={fixture.schema}
          uischema={uischema}
          path=''
          visible={true}
          enabled={true}
          direction='column'
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('should render children', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/foo',
        } as ControlElement,
        {
          type: 'Control',
          scope: '#/properties/bar',
        } as ControlElement,
      ],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayout
          schema={fixture.schema}
          uischema={uischema}
          path=''
          visible={true}
          enabled={true}
          direction='column'
        />
      </JsonFormsStateProvider>
    );

    // Should have a div container
    expect(wrapper.find('div').first().exists()).toBe(true);
    // Should have 2 children elements in the layout
    const container = wrapper.find('div').first();
    expect(container.children().length).toBe(2);
  });

  it('should not render when visible is false', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayout
          schema={fixture.schema}
          uischema={uischema}
          path=''
          visible={false}
          enabled={true}
          direction='column'
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('should apply vertical layout classes', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayout
          schema={fixture.schema}
          uischema={uischema}
          path=''
          visible={true}
          enabled={true}
          direction='column'
        />
      </JsonFormsStateProvider>
    );

    const div = wrapper.find('div').first();
    const className = div.prop('className');
    expect(className).toContain('flex');
    expect(className).toContain('flex-col');
    expect(className).toContain('space-y-4');
  });

  it('should handle empty elements array', () => {
    const uischema: VerticalLayoutSchema = {
      type: 'VerticalLayout',
      elements: [],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <VerticalLayout
          schema={fixture.schema}
          uischema={uischema}
          path=''
          visible={true}
          enabled={true}
          direction='column'
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('div').first().exists()).toBe(true);
    expect(wrapper.find('JsonFormsDispatch').length).toBe(0);
  });
});
