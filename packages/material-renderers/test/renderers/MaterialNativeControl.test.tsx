/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { MaterialNativeControl } from '../../src/controls/MaterialNativeControl';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement, ControlProps } from '@jsonforms/core';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'time',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const createMaterialNativeControl = (props: ControlProps) => {
  return <MaterialNativeControl {...props} />;
};

const defaultControlProps = (): ControlProps => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleChange: () => {},
    enabled: false,
    visible: true,
    path: 'path',
    rootSchema: schema,
    schema: schema.properties.foo,
    uischema: uischema,
    label: 'Foo',
    id: 'foo-id',
    errors: '',
    data: '',
  };
};

describe('Material native control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('is disabled', () => {
    const props = defaultControlProps();
    wrapper = mount(createMaterialNativeControl(props));
    expect(
      (wrapper.find(TextField).props() as TextFieldProps).disabled
    ).toEqual(true);
  });
});
