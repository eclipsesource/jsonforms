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
import React from 'react';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement } from '@jsonforms/core';
import { MaterialAllOfRenderer, materialRenderers } from '../../src';
import { JsonForms, JsonFormsStateProvider } from '@jsonforms/react';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

describe('Material allOf renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render', () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          allOf: [
            {
              title: 'String',
              type: 'string',
            },
            {
              title: 'Number',
              type: 'number',
            },
          ],
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value',
    };
    wrapper = mount(
      <JsonForms
        data={undefined}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialAllOfRenderer).length).toBeTruthy();
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(2);
  });

  it('should be hideable', () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          allOf: [
            {
              title: 'String',
              type: 'string',
            },
            {
              title: 'Number',
              type: 'number',
            },
          ],
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value',
    };
    const core = initCore(schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialAllOfRenderer
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
