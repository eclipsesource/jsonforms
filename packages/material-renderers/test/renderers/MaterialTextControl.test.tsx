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
import React from 'react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { MaterialTextControl } from '../../src/controls/MaterialTextControl';
import { MaterialInputControl } from '../../src/controls/MaterialInputControl';
import { MuiInputText } from '../../src/mui-controls/MuiInputText';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement, ControlProps } from '@jsonforms/core';
import { InputAdornment, OutlinedInput } from '@mui/material';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const createMaterialTextControl = (props: ControlProps) => {
  return <MaterialTextControl {...props} />;
};

const defaultControlProps = (): ControlProps => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleChange: () => {},
    enabled: true,
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

describe('Material text control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('render', () => {
    const props = defaultControlProps();
    wrapper = mount(createMaterialTextControl(props));
    expect(wrapper.find(MaterialInputControl).props()).toEqual({
      ...props,
      input: MuiInputText,
    });

    expect(wrapper.find('input').props().id).toEqual(`${props.id}-input`);
  });

  it('allows adding of mui input props', () => {
    const props = {
      ...defaultControlProps(),
      muiInputProps: { spellCheck: false },
    };
    wrapper = mount(createMaterialTextControl(props));
    expect(wrapper.find('input').props().spellCheck).toEqual(false);
  });

  it('shows clear button when data exists', () => {
    const props = defaultControlProps();
    wrapper = mount(createMaterialTextControl(props));
    // call onPointerEnter prop manually as the tests seem to ignore 'pointerenter' events, 'mouseover' events work however.
    wrapper.find(OutlinedInput).props().onPointerEnter?.call(this);
    wrapper.update();
    expect(wrapper.find(InputAdornment).props().style).not.toHaveProperty(
      'display',
      'none'
    );
  });

  it('hides clear button when data is undefined', () => {
    const props = defaultControlProps();
    delete props.data;
    wrapper = mount(createMaterialTextControl(props));
    // call onPointerEnter prop manually as the tests seem to ignore 'pointerenter' events, 'mouseover' events work however.
    wrapper.find(OutlinedInput).props().onPointerEnter?.call(this);
    wrapper.update();
    expect(wrapper.find(InputAdornment).props().style).toHaveProperty(
      'display',
      'none'
    );
  });
});
