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
import { ControlElement, NOT_APPLICABLE } from '@jsonforms/core';
import MaterialOneOfRadioGroupControl, {
  materialOneOfRadioGroupControlTester,
} from '../../src/controls/MaterialOneOfRadioGroupControl';
import { materialRenderers } from '../../src';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore } from './util';
Enzyme.configure({ adapter: new Adapter() });

const oneOfSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      oneOf: [
        { const: 'A', title: 'Option A' },
        { const: 'B' },
        { const: 'C', title: 'Option C' },
      ],
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    format: 'radio',
  },
};

describe('Material oneof radio group tester', () => {
  it('should return valid rank for oneof enums with radio format', () => {
    const rank = materialOneOfRadioGroupControlTester(
      uischema,
      oneOfSchema,
      undefined
    );
    expect(rank).not.toBe(NOT_APPLICABLE);
  });

  it('should return NOT_APPLICABLE for enums without radio format', () => {
    const uiSchemaNoRadio = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    const rank = materialOneOfRadioGroupControlTester(
      uiSchemaNoRadio,
      oneOfSchema,
      undefined
    );
    expect(rank).toBe(NOT_APPLICABLE);
  });
});

describe('Material oneof radio group control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render oneOf schemas ', () => {
    const core = initCore(oneOfSchema, uischema, { foo: 'B' });

    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialOneOfRadioGroupControl
          schema={oneOfSchema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input[type="radio"]');
    expect(inputs.length).toBe(3);
    const currentlyChecked = inputs.find('[checked=true]');
    expect(currentlyChecked.length).toBe(1);
    expect(currentlyChecked.first().props().value).toBe('B');
  });
});
