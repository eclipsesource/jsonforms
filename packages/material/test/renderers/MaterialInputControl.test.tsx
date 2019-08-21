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
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { materialRenderers } from '../../src';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';
import {
  Actions,
  ControlElement,
  ControlProps,
  ControlState,
  HorizontalLayout,
  isControl,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  mapDispatchToControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  UISchemaElement
} from '@jsonforms/core';
import { Control, JsonFormsReduxContext } from '@jsonforms/react';
import '../../src/cells';
import { MaterialInputControl } from '../../src/controls/MaterialInputControl';
import MaterialHorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { MuiInputText } from '../../src/mui-controls';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 'bar' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};
class TestControlInner extends Control<ControlProps, ControlState> {
  render() {
    return <MaterialInputControl {...this.props} input={MuiInputText} />;
  }
}
export const testControlTester: RankedTester = rankWith(1, isControl);
const TestControl = connect(
  mapStateToControlProps,
  mapDispatchToControlProps
)(TestControlInner);

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
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material input control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const control = wrapper.find('div').first();
    expect(control.children()).toHaveLength(4);

    const label = wrapper.find('label');
    expect(label.text()).toBe('Foo');

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);

    const validation = wrapper.find('p').first();
    expect(validation.props().className).toContain('MuiFormHelperText-root');
    expect(validation.children()).toHaveLength(0);
  });

  it('should render without label', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      label: false
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const div = wrapper.find('div').first();
    expect(div.children()).toHaveLength(4);

    const label = wrapper.find('label');
    expect(label.text()).toBe('');

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);

    const validation = wrapper.find('p').first();
    expect(validation.props().className).toContain('MuiFormHelperText-root');
    expect(validation.children()).toHaveLength(0);
  });

  it('can be hidden', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} visible={false} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });

  it('should be shown by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const control = wrapper.find('div').first();
    expect(control.props().hidden).toBeFalsy();
  });

  it('should display a single error', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    store.dispatch(Actions.update('foo', () => 2));
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('should be string');
  });

  it('should display multiple errors', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => 3));
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('should be string');
  });

  it('should not show any errors', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('');
  });

  it('should handle validation updates', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('foo', () => 3));
    store.dispatch(Actions.update('foo', () => 'bar'));
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('');
  });

  it('should handle validation with nested schemas', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        personalData: {
          type: 'object',
          properties: {
            middleName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            }
          },
          required: ['middleName', 'lastName']
        }
      },
      required: ['name']
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/middleName'
    };
    const thirdControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/lastName'
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement, thirdControlElement]
    };
    const store = initJsonFormsStore(
      {
        name: 'John Doe',
        personalData: {}
      },
      jsonSchema,
      layout
    );
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialHorizontalLayoutRenderer
            schema={jsonSchema}
            uischema={layout}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const validation = wrapper.find('p');
    expect(validation).toHaveLength(6);
    expect(validation.at(0).text()).toBe('');
    expect(validation.at(2).text()).toBe('is a required property');
    expect(validation.at(4).text()).toBe('is a required property');
  });

  it('should display a marker for a required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date'
        }
      },
      required: ['dateCell']
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell'
    };

    const store = initJsonFormsStore({}, jsonSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={jsonSchema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').first();
    expect(label.text()).toBe('Date Cell*');
  });

  it('should not display a marker for a non-required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date'
        }
      }
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell'
    };

    const store = initJsonFormsStore({}, jsonSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TestControl schema={jsonSchema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const label = wrapper.find('label').first();
    expect(label.text()).toBe('Date Cell');
  });

  it('should display a password cell if the password option is set', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        password: { type: 'string' }
      }
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/password',
      options: { format: 'password' }
    };
    const store = initJsonFormsStore({}, jsonSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <TestControl schema={jsonSchema} uischema={control} />
      </Provider>
    );
    const input = wrapper.find('input');
    expect(input.props().type).toBe('password');
  });

  it('should render own id and create/use input id', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const store = initJsonFormsStore({}, jsonSchema, control);
    wrapper = mount(
      <Provider store={store}>
        <TestControl
          schema={jsonSchema}
          uischema={control}
          id={control.scope}
        />
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().id).toBe('#/properties/name-input');

    const label = wrapper.find('label').first();
    expect(label.props().htmlFor).toBe('#/properties/name-input');

    const rootDiv = wrapper.find('div').first();
    expect(rootDiv.props().id).toBe('#/properties/name');
  });
});
