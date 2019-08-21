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
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import SliderControl, {
  materialSliderControlTester
} from '../../src/controls/MaterialSliderControl';
import { Provider } from 'react-redux';
import { materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';
import { Slider } from '@material-ui/core';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 5 };
const schema = {
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
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    slider: true
  }
};

const initJsonFormsStore = (
  testData: any,
  testSchema: JsonSchema,
  testUiSchema: UISchemaElement
): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material slider tester', () => {
  it('should fail', () => {
    expect(materialSliderControlTester(undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialSliderControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialSliderControlTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialSliderControlTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
  });

  it('should fail with wrong schema type', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if only sibling has correct prop type', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'number' }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum and minimum are missing', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'number' }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if maximum is missing', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            minimum: 2
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail if minimum is missing', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should fail is default is missing', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10,
            minimum: 2
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed with number type', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10,
            minimum: 2,
            default: 6
          }
        }
      })
    ).toBe(4);
  });

  it('should succeed with integer type', () => {
    expect(
      materialSliderControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'integer',
            maximum: 10,
            minimum: 2,
            default: 6
          }
        }
      })
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
          default: 6
        }
      }
    };
    const store = initJsonFormsStore({ foo: 5 }, jsonSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={jsonSchema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should update via action', () => {
    const store = initJsonFormsStore({ foo: 3 }, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    let slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(3);
    store.dispatch(Actions.update('foo', () => 4));
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
          multipleOf: 2
        }
      }
    };
    const store = initJsonFormsStore(
      { foo: 6 },
      schemaWithMultipleOf,
      uischema
    );
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schemaWithMultipleOf} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find(Slider).first();
    expect(input.props().step).toBe(2);
  });

  it('should not update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => undefined));
    wrapper.update();
    const input = wrapper.find(Slider);
    expect(input.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => null));
    wrapper.update();
    const slider = wrapper.find(Slider).first();
    expect(slider.props().value).toBe(schema.properties.foo.default);
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('bar', () => 11));
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update(null, () => 3));
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update(undefined, () => 13));
    wrapper.update();
    const input = wrapper.find(Slider).first();
    expect(input.props().value).toBe(5);
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} enabled={false} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find(Slider).first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should render id and input id', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl
            schema={schema}
            uischema={uischema}
            id='#/properties/foo'
          />
        </JsonFormsReduxContext>
      </Provider>
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
          default: 6
        }
      }
    };
    const store = initJsonFormsStore({ foo: 5 }, jsonSchema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SliderControl
            schema={jsonSchema}
            uischema={uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const inputs = wrapper.find(Slider);
    expect(inputs.length).toBe(0);
  });
});
