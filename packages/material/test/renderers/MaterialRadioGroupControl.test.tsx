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
import { ControlElement, JsonSchema, update } from '@jsonforms/core';
import MaterialRadioGroupControl from '../../src/controls/MaterialRadioGroupControl';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsContext, JsonFormsStateContext, JsonFormsStateProvider, RefResolver } from '@jsonforms/react';
import { waitForResolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });
import { act } from 'react-dom/test-utils';

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
  scope: '#/properties/foo'
};

describe('Material radio group control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should have option selected', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <RefResolver schema={schema} pointer={uischema.scope}>
          {(resolvedSchema: JsonSchema) =>
            (<MaterialRadioGroupControl schema={resolvedSchema} uischema={uischema} />)
          }
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const radioButtons = wrapper.find('input[type="radio"]');
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(radioButtons.length).toBe(4);
    expect(currentlyChecked.first().props().value).toBe('D');
  });

  it('should have only update selected option ', async () => {
    let ctx: JsonFormsStateContext;

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {
            (context: JsonFormsStateContext) => {
              ctx = context;
              return (
                <RefResolver schema={schema} pointer={uischema.scope}>
                  {
                    (resolvedSchema: JsonSchema) =>
                      <MaterialRadioGroupControl schema={resolvedSchema} uischema={uischema} />
                  }
                </RefResolver>
              );
            }
          }
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    act(() => { ctx.dispatch(update('foo', () => 'A')); });
    act(() => { ctx.dispatch(update('foo', () => 'B')); });
    wrapper.update();
    const currentlyChecked = wrapper.find('input[type="radio"][checked=true]');
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked.first().props().value).toBe('B');
  });

  it('should be hideable ', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <RefResolver schema={schema} pointer={uischema.scope}>
          {(resolvedSchema: JsonSchema) =>
            <MaterialRadioGroupControl schema={resolvedSchema} uischema={uischema} visible={false} />
          }
        </RefResolver>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const radioButtons = wrapper.find('input[type="radio"]');
    expect(radioButtons.length).toBe(0);
  });
});
