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
  NOT_APPLICABLE
} from '@jsonforms/core';
import MaterialRadioGroupControl, { materialRadioGroupControlTester } from '../../src/controls/MaterialRadioGroupControl';
import { materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore } from './util';
Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 'D' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      enum: ['A', 'B', 'C', 'D']
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    format: 'radio'
  }
};

describe('Material radio group tester', () => {
  it('should return valid rank for enums with radio format', () => {
    const rank = materialRadioGroupControlTester(uischema, schema, undefined);
    expect(rank).not.toBe(NOT_APPLICABLE);
  });

  it('should return NOT_APPLICABLE for enums without radio format', () => {
    const uiSchemaNoRadio = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const rank = materialRadioGroupControlTester(uiSchemaNoRadio, schema, undefined);
    expect(rank).toBe(NOT_APPLICABLE);
  });
});

describe('Material radio group control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should have option selected', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialRadioGroupControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(radioButtons.length).toBe(4);
    expect(currentlyChecked.first().props().value).toBe('D');
  });

  it('should have only update selected option ', () => {
    const core = initCore(schema, uischema, data);

    core.data = { ...core.data, foo: 'A' };
    core.data = { ...core.data, foo: 'B' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialRadioGroupControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked.first().props().value).toBe('B');
  });

  it('should be hideable ', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialRadioGroupControl
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    expect(radioButtons.length).toBe(0);
  });
});
