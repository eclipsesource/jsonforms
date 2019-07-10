import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  ControlProps,
  OwnPropsOfEnum,
  Actions,
  jsonformsReducer,
  JsonFormsState,
  rankWith
} from '@jsonforms/core';

import { JsonForms } from '../src/JsonForms';
import { withJsonFormsEnumProps } from '../src/JsonFormsContext';
// import {
//   JsonFormsReduxContext
// } from '../src/JsonFormsContext';
// import { Provider } from 'react-redux';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';

Enzyme.configure({ adapter: new Adapter() });

export const initJsonFormsStore = (): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {}
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  // const { data, schema, uischema } = fixture;
  store.dispatch(Actions.init({}, {}));

  return store;
};

test('withJsonFormsEnumProps - constant: should supply control and enum props', () => {
  const MockEnumControlUnwrapped = (_: ControlProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumProps(MockEnumControlUnwrapped);

  // const store = initJsonFormsStore()
  //
  const schema = {
    type: 'object',
    properties: {
      name: {
        const: 'Cambodia'
      }
    },
    required: ['country']
  };

  const renderers = [
    {
      tester: rankWith(1, () => true),
      renderer: MockEnumControl
    }
  ];

  const uischema = {
    type: 'Control',
    scope: '#/properties/name'
  };

  const wrapper = mount(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={renderers}
    />
  );
  const mockEnumControlUnwrappedProps = wrapper
    .find(MockEnumControlUnwrapped)
    .props();

  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.name);
  expect(mockEnumControlUnwrappedProps.path).toEqual('name');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/name');
  expect(mockEnumControlUnwrappedProps.options).toEqual(['Cambodia']);
});

test('withJsonFormsEnumProps - enum: should supply control and enum props', () => {
  const MockEnumControlUnwrapped = (_: ControlProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumProps(MockEnumControlUnwrapped);

  // const store = initJsonFormsStore()
  //
  const schema = {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        enum: ['red', 'amber', 'green', null]
      }
    },
    required: ['color']
  };

  const renderers = [
    {
      tester: rankWith(1, () => true),
      renderer: MockEnumControl
    }
  ];

  const uischema = {
    type: 'Control',
    scope: '#/properties/color'
  };

  const wrapper = mount(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={renderers}
    />
  );
  const mockEnumControlUnwrappedProps = wrapper.find(MockEnumControlUnwrapped).props()
  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.color);
  expect(mockEnumControlUnwrappedProps.path).toEqual('color');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/color');
  expect(mockEnumControlUnwrappedProps.options).toEqual([
    'red',
    'amber',
    'green',
    null
  ]);
});
