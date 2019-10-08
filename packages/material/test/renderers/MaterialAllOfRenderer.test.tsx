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
import './MatchMediaMock';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { MaterialAllOfRenderer, materialRenderers } from '../../src';
import { JsonFormsStateProvider, ResolveRef } from '@jsonforms/react';
import { resolveRef, waitForResolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

describe('Material allOf renderer', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render', async () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          allOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data: undefined },
          renderers: materialRenderers
        }}
      >
        <ResolveRef schema={schema} pointer={uischema.scope} refResolver={resolveRef(schema)}>
          {(resolvedSchema: JsonSchema) => (
            <MaterialAllOfRenderer
              schema={resolvedSchema}
              uischema={uischema}
              renderers={materialRenderers}
              visible
            />
          )}
        </ResolveRef>
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(2);
  });

  it('should be hideable', async () => {
    const schema = {
      type: 'object',
      properties: {
        value: {
          allOf: [
            {
              title: 'String',
              type: 'string'
            },
            {
              title: 'Number',
              type: 'number'
            }
          ]
        }
      }
    };
    const uischema: ControlElement = {
      type: 'Control',
      label: 'Value',
      scope: '#/properties/value'
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { schema, uischema, data: undefined },
          renderers: materialRenderers
        }}
      >
        <ResolveRef schema={schema} pointer={uischema.scope} refResolver={resolveRef(schema)}>
          {(resolvedSchema: JsonSchema) => (
            <MaterialAllOfRenderer
              schema={resolvedSchema}
              uischema={uischema}
              renderers={materialRenderers}
              visible={false}
            />
          )}
        </ResolveRef>
      </JsonFormsStateProvider>
    );
    await waitForResolveRef(wrapper);
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });
});
