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
import * as React from 'react';
import { ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MaterialAdditionalPropertiesRenderer from '../../src/additional/MaterialAdditionalPropertiesRenderer';
import { materialRenderers } from '../../src';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  additionalProperties: {
    type: 'string',
  },
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/',
};

const data = {
  name: 'John Doe',
  additionalProp1: 'value1',
  additionalProp2: 'value2',
};

describe('MaterialAdditionalPropertiesRenderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render additional properties', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={initCore(schema, uischema, data)}
        renderers={materialRenderers}
      >
        <MaterialAdditionalPropertiesRenderer
          schema={schema}
          rootSchema={schema}
          path=""
          data={data}
          handleChange={() => {}}
          enabled={true}
          visible={true}
          renderers={materialRenderers}
          cells={[]}
          config={{}}
          label=""
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find('input[value="additionalProp1"]')).toHaveLength(0); // Property names are not editable
    expect(wrapper.find('input')).not.toHaveLength(0); // But there should be input fields for values and new property name
  });

  test('should allow adding new properties', () => {
    const handleChange = jest.fn();
    
    wrapper = mount(
      <JsonFormsStateProvider
        initState={initCore(schema, uischema, data)}
        renderers={materialRenderers}
      >
        <MaterialAdditionalPropertiesRenderer
          schema={schema}
          rootSchema={schema}
          path=""
          data={data}
          handleChange={handleChange}
          enabled={true}
          visible={true}
          renderers={materialRenderers}
          cells={[]}
          config={{}}
          label=""
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    // Find the property name input field
    const propertyNameInput = wrapper.find('input[label="Property Name"]').first();
    propertyNameInput.simulate('change', { target: { value: 'newProp' } });

    // Find and click the add button
    const addButton = wrapper.find('button').filterWhere(n => 
      n.find('AddIcon').length > 0
    );
    
    expect(addButton).toHaveLength(1);
    addButton.simulate('click');

    // Verify handleChange was called
    expect(handleChange).toHaveBeenCalled();
  });

  test('should not render when not visible', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={initCore(schema, uischema, data)}
        renderers={materialRenderers}
      >
        <MaterialAdditionalPropertiesRenderer
          schema={schema}
          rootSchema={schema}
          path=""
          data={data}
          handleChange={() => {}}
          enabled={true}
          visible={false}
          renderers={materialRenderers}
          cells={[]}
          config={{}}
          label=""
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  test('should disable controls when not enabled', () => {
    wrapper = mount(
      <JsonFormsStateProvider
        initState={initCore(schema, uischema, data)}
        renderers={materialRenderers}
      >
        <MaterialAdditionalPropertiesRenderer
          schema={schema}
          rootSchema={schema}
          path=""
          data={data}
          handleChange={() => {}}
          enabled={false}
          visible={true}
          renderers={materialRenderers}
          cells={[]}
          config={{}}
          label=""
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    // Check that inputs are disabled
    const inputs = wrapper.find('input');
    inputs.forEach(input => {
      expect(input.prop('disabled')).toBe(true);
    });

    // Check that buttons are disabled
    const buttons = wrapper.find('button');
    buttons.forEach(button => {
      expect(button.prop('disabled')).toBe(true);
    });
  });
});