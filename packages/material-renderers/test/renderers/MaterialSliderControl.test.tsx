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
import { ControlElement, JsonSchema, NOT_APPLICABLE } from '@jsonforms/core';
import SliderControl, {
  materialSliderControlTester,
} from '../../src/controls/MaterialSliderControl';
import { materialRenderers } from '../../src';
import { Slider } from '@mui/material';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonForms, JsonFormsStateProvider } from '@jsonforms/react';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data: any = { foo: 5 };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      maximum: 10,
      minimum: 2,
      default: 6,
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    slider: true,
  },
};

describe('Material slider tester', () => {
  it('should fail', () => {
    expect(materialSliderControlTester(undefined, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialSliderControlTester(null, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialSliderControlTester({ type: 'Foo' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
    expect(
      materialSliderControlTester({ type: 'Control' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail with wrong schema type', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct prop type', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
            bar: { type: 'number' },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum and minimum are missing', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: { type: 'number' },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum is missing', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              minimum: 2,
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if minimum is missing', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail is default is missing', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2,
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with number type', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              maximum: 10,
              minimum: 2,
              default: 6,
            },
          },
        },
        undefined
      )
    ).toBe(4);
  });

  it('should succeed with integer type', () => {
    expect(
      materialSliderControlTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
              maximum: 10,
              minimum: 2,
              default: 6,
            },
          },
        },
        undefined
      )
    ).toBe(4);
  });
});

describe('Material slider control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6,
        },
      },
    };
    const core = initCore(jsonSchema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <SliderControl schema={jsonSchema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should update via action', () => {
    let data = {
      foo: 3,
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    let slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(3);
    data = { ...data, foo: 4 };
    wrapper.setProps({ data: data });
    wrapper.update();
    slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(4);
  });

  it('should honor multipleOf', () => {
    const schemaWithMultipleOf = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6,
          multipleOf: 2,
        },
      },
    };
    const data = {
      foo: 6,
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schemaWithMultipleOf}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const input = wrapper.find(Slider).first();
    expect(input.props().step).toBe(2);
  });

  it('should not update with undefined value', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const newData = { ...data, foo: undefined };
    wrapper.setProps({ data: newData });
    wrapper.update();
    const input = wrapper.find(Slider);
    expect(input.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with null value', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const newData = { ...data, foo: null };
    wrapper.setProps({ data: newData });
    wrapper.update();
    const slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with wrong ref', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const newData = { ...data, bar: 11 };
    wrapper.setProps({ data: newData });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with null ref', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const newData = { ...data, null: 3 };
    wrapper.setProps({ data: newData });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with undefined ref', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const newData = { ...data, undefined: 13 };
    wrapper.setProps({ data: newData });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('can be disabled', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <SliderControl schema={schema} uischema={uischema} enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(SliderControl).length).toBeTruthy();
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should render id and input id', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <SliderControl
          schema={schema}
          uischema={uischema}
          id='#/properties/foo'
        />
      </JsonFormsStateProvider>
    );
    const divs = wrapper.find('div');
    // id
    expect(divs.find((d: any) => d.id === '#/properties/foo')).toBeDefined();
    // input id
    expect(
      divs.find((d: any) => d.id === '#/properties/foo-input')
    ).toBeDefined();
  });

  it('should be hideable', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6,
        },
      },
    };
    const core = initCore(schema, uischema, { foo: 5 });
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <SliderControl
          schema={jsonSchema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const inputs = wrapper.find(Slider);
    expect(inputs.length).toBe(0);
  });
});
