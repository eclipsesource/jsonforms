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
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MaterialGroupLayout from '../../src/layouts/MaterialGroupLayout';
import { MaterialLayoutRenderer } from '../../src/util/layout';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your name'
    },
    birthDate: {
      type: 'string',
      format: 'date',
      description: 'Please enter your birth date.'
    }
  }
};

const uischema = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate'
    }
  ]
};

describe('Material group layout', () => {
  it('should render a GroupComponent with direction column when given no direction LayoutProp', () => {
    const wrapper = mount(
      <MaterialGroupLayout schema={schema} uischema={uischema} direction="column" enabled visible path=""/>
    );
    expect(wrapper.find(MaterialLayoutRenderer).props().direction).toBe(
      'column'
    );
  });

  it('should render a GroupComponent with direction row when this is provided as a direction prop', () => {
    const wrapper = mount(
      <MaterialGroupLayout
        schema={schema}
        uischema={uischema}
        direction={'row'}
        enabled
        visible
        path=""
      />
    );
    expect(wrapper.find(MaterialLayoutRenderer).props().direction).toBe('row');
  });
});
