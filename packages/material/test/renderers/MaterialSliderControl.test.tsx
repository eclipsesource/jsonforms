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
  Actions,
  ControlElement,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import { Slider } from '@material-ui/core';
import SliderControl, { materialSliderControlTester } from '../../src/controls/MaterialSliderControl';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { JsonFormsContext, JsonFormsStateContext, JsonFormsStateProvider, ScopedRenderer } from '@jsonforms/react';
import { resolveRef, waitForScopedRenderer } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const data = { 'foo': 5 };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      maximum: 10,
      minimum: 2,
      default: 6
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    slider: true
  }
};

describe('Material slider tester', () => {

  it('should fail', async () => {
    expect(await materialSliderControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialSliderControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialSliderControlTester({ type: 'Foo' }, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialSliderControlTester({ type: 'Control' }, undefined)).toBe(NOT_APPLICABLE);
  });

  it('should fail with wrong schema type', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: { type: 'string' }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct prop type', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
              bar: { type: 'number' }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum and minimum are missing', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: { type: 'number' }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum is missing', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
                minimum: 2
              }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if minimum is missing', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
                maximum: 10
              }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail is default is missing', async () => {
    expect(
      await
        materialSliderControlTester(
          uischema,
          {
            type: 'object',
            properties: {
              foo: {
                type: 'number',
                maximum: 10,
                minimum: 2
              }
            }
          },
          resolveRef
        )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with number type', async () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6
        }
      }
    };
    expect(await materialSliderControlTester(uischema, jsonSchema, resolveRef(jsonSchema))).toBe(4);
  });

  it('should succeed with integer type', async () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'integer',
          maximum: 10,
          minimum: 2,
          default: 6
        }
      }
    };
    expect(await materialSliderControlTester(uischema, jsonSchema, resolveRef(jsonSchema))).toBe(4);
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
          default: 6
        }
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 5 }, schema: jsonSchema, uischema } }}>
        <SliderControl schema={jsonSchema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should update via action', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 3 }, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (<SliderControl schema={schema} uischema={uischema} />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    let slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(3);
    act(() => { ctx.dispatch(Actions.update('foo', () => 4)); });
    wrapper.update();
    slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(4);
  });

  it('should honor multipleOf', async () => {
    const schemaWithMultipleOf = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6,
          multipleOf: 2
        },
      },
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 6 }, schema: schemaWithMultipleOf, uischema } }}>
        <ScopedRenderer schema={schemaWithMultipleOf} uischema={uischema} refResolver={resolveRef(schemaWithMultipleOf)}>
          {
            (resolvedSchema: JsonSchema) =>
              <SliderControl schema={resolvedSchema} uischema={uischema} />
          }
        </ScopedRenderer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    const input = wrapper.find(Slider).first();
    expect(input.props().step).toBe(2);
  });

  it('should not update with undefined value', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (
              <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
                {
                  (resolvedSchema: JsonSchema) =>
                    <SliderControl schema={resolvedSchema} uischema={uischema} />
                }
              </ScopedRenderer>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    act(() => { ctx.dispatch(Actions.update('foo', () => undefined)); });
    wrapper.update();
    const input = wrapper.find(Slider);
    expect(input.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with null value', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (
              <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
                {
                  (resolvedSchema: JsonSchema) =>
                    <SliderControl schema={resolvedSchema} uischema={uischema} />
                }
              </ScopedRenderer>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    act(() => { ctx.dispatch(Actions.update('foo', () => null)); });
    wrapper.update();
    const slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with wrong ref', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (
              <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
                {
                  (resolvedSchema: JsonSchema) =>
                    <SliderControl schema={resolvedSchema} uischema={uischema} />
                }
              </ScopedRenderer>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    act(() => { ctx.dispatch(Actions.update('bar', () => 11)); });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with null ref', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (
              <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
                {
                  (resolvedSchema: JsonSchema) =>
                    <SliderControl schema={resolvedSchema} uischema={uischema} />
                }
              </ScopedRenderer>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    act(() => { ctx.dispatch(Actions.update(null, () => 3)); });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with undefined ref', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <JsonFormsContext.Consumer>
          {context => {
            ctx = context;
            return (
              <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
                {
                  (resolvedSchema: JsonSchema) =>
                    <SliderControl schema={resolvedSchema} uischema={uischema} />
                }
              </ScopedRenderer>
            );
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    act(() => { ctx.dispatch(Actions.update(undefined, () => 13)); });
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('can be disabled', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
          {
            (resolvedSchema: JsonSchema) =>
              <SliderControl schema={resolvedSchema} uischema={uischema} enabled={false} />
          }
        </ScopedRenderer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
          {
            (resolvedSchema: JsonSchema) =>
              <SliderControl schema={resolvedSchema} uischema={uischema} />
          }
        </ScopedRenderer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should render id and input id', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data, schema, uischema } }}>
        <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(schema)}>
          {(resolvedSchema: JsonSchema) =>
            <SliderControl schema={resolvedSchema} uischema={uischema} id='#/properties/foo' />
          }
        </ScopedRenderer>
      </JsonFormsStateProvider>
    );
    await waitForScopedRenderer(wrapper);
    const divs = wrapper.find('div');
    // id
    expect(divs.find((d: any) => d.id === '#/properties/foo')).toBeDefined();
    // input id
    expect(divs.find((d: any) => d.id === '#/properties/foo-input')).toBeDefined();
  });

  it('should be hideable', async () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'number',
          maximum: 10,
          minimum: 2,
          default: 6
        }
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { data: { foo: 5 }, schema: jsonSchema, uischema } }}>
        <ScopedRenderer schema={schema} uischema={uischema} refResolver={resolveRef(jsonSchema)}>
          {(resolvedSchema: JsonSchema) =>
            <SliderControl schema={resolvedSchema} uischema={uischema} visible={false} />
          }
        </ScopedRenderer>
      </JsonFormsStateProvider >
    );

    await waitForScopedRenderer(wrapper);
    const inputs = wrapper.find(Slider);
    expect(inputs.length).toBe(0);
  });
});
