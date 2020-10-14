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
import React from 'react';
import {
  ControlElement,
  NOT_APPLICABLE,
} from '@jsonforms/core';
import MaterialDateTimeControl, {
  materialDateTimeControlTester
} from '../../src/controls/MaterialDateTimeControl';
import moment from 'moment';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: moment('1980-04-04 13:37').format() };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date-time'
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material date time control tester', () => {
  it('should fail', () => {
    expect(materialDateTimeControlTester(undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialDateTimeControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateTimeControlTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialDateTimeControlTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialDateTimeControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      })
    ).toBe(NOT_APPLICABLE);
    expect(
      materialDateTimeControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'date-time'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialDateTimeControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date-time'
          }
        }
      })
    ).toBe(2);
  });
});

describe('Material date time control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={control} />
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
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
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
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('text');
    expect(input.props().value).toBe('04/04/1980 1:37 pm');
  });

  it('should update via event', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: '04/12/1961 8:15 pm' } });
    expect(onChangeData.data.foo).toBe(
      moment('1961-04-12 20:15').format()
    );
  });

  it('should update via action', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: moment('1961-04-12 20:15').format() };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('04/12/1961 8:15 pm');
  });

  it('should update with null value', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with undefined value', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 'Bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('04/04/1980 1:37 pm');
  });

  it('should not update with null ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: '12.04.1961 20:15' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('04/04/1980 1:37 pm');
  });

  it('should not update with undefined ref', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: '12.04.1961 20:15' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('04/04/1980 1:37 pm');
  });

  it('can be disabled', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl
          schema={schema}
          uischema={uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should render input id', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl
          schema={schema}
          uischema={uischema}
          id='#/properties/foo'
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    // there is only input id at the moment
    expect(input.props().id).toBe('#/properties/foo-input');
  });

  it('should be hideable', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialDateTimeControl
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });
});
