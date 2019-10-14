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
import { Provider } from 'react-redux';
import {
  Actions,
  ControlElement,
  getData,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import MaterialDateControl, {
  materialDateControlTester
} from '../../src/controls/MaterialDateControl';
import * as React from 'react';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsReduxContext } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

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

const data = { foo: '1980-06-04' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date'
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material date control tester', () => {
  test('should fail', () => {
    expect(materialDateControlTester(undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialDateControlTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialDateControlTester({ type: 'Foo' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(materialDateControlTester({ type: 'Control' }, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialDateControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      })
    ).toBe(NOT_APPLICABLE);
    expect(
      materialDateControlTester(uischema, {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {
            type: 'string',
            format: 'date'
          }
        }
      })
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialDateControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            format: 'date'
          }
        }
      })
    ).toBe(4);
  });
});

describe('Material date control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBe(true);
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const store = initJsonFormsStore(data, schema, control);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={control} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('text');
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should update via event', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: '1961-04-12' } });
    expect(getData(store.getState()).foo).toBe('1961-04-12');
  });

  it('should update via action', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    // we need a class component as otherwise wrapper.instance() === null
    class TestComponent extends React.Component {
      render = () => (
        <Provider store={store}>
          <JsonFormsReduxContext>
            <MaterialDateControl schema={schema} uischema={uischema} />
          </JsonFormsReduxContext>
        </Provider>
      );
    }
    wrapper = mount(<TestComponent />);
    store.dispatch(Actions.update('foo', () => '1961-04-12'));
    // TODO get rid of forceUpdate when possible
    wrapper.instance().forceUpdate();
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1961-04-12');
  });

  it('should update with null value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    // we need a class component as otherwise wrapper.instance() === null
    class TestComponent extends React.Component {
      render = () => (
        <Provider store={store}>
          <JsonFormsReduxContext>
            <MaterialDateControl schema={schema} uischema={uischema} />
          </JsonFormsReduxContext>
        </Provider>
      );
    }
    wrapper = mount(<TestComponent />);
    store.dispatch(Actions.update('foo', () => null));
    // TODO get rid of forceUpdate when possible
    wrapper.instance().forceUpdate();
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should update with undefined value', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    // we need a class component as otherwise wrapper.instance() === null
    class TestComponent extends React.Component {
      render = () => (
        <Provider store={store}>
          <JsonFormsReduxContext>
            <MaterialDateControl schema={schema} uischema={uischema} />
          </JsonFormsReduxContext>
        </Provider>
      );
    }
    wrapper = mount(<TestComponent />);
    store.dispatch(Actions.update('foo', () => undefined));
    // TODO get rid of forceUpdate when possible
    wrapper.instance().forceUpdate();
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update('bar', () => 'Bar'));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should not update with null ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update(null, () => '1961-04-12'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1980-06-04');
  });

  it('should not update with undefined ref', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(Actions.update(undefined, () => '1961-04-12'));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('1980-06-04');
  });

  it('can be disabled', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl
            schema={schema}
            uischema={uischema}
            enabled={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('should render input id', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl
            schema={schema}
            uischema={uischema}
            id='#/properties/foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').first();
    // there is only input id at the moment
    expect(input.props().id).toBe('#/properties/foo-input');
  });

  it('should be hideable', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <MaterialDateControl
            schema={schema}
            uischema={uischema}
            visible={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });
});
