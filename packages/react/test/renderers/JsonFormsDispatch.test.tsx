import React from 'react';
import { JsonFormsInitialState } from './JsonFormsDispatchRenderer.test';
import { jsonformsReducer, JsonFormsState, JsonFormsStore, registerRenderer, RendererProps } from '@jsonforms/core';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { JsonFormsReduxContext } from '../../src/JsonFormsContext';
import { JsonFormsDispatch, JsonFormsDispatchRenderer } from '../../src/JsonForms';
import { mount } from 'enzyme';
import { StatelessRenderer } from '../../src/Renderer';
import { act } from 'react-dom/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  data: { foo: 'John Doe' },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo'
  },
  schema: {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  }
};

export const initJsonFormsStore = ({
  data,
  schema,
  uischema,
  ...props
}: JsonFormsInitialState): JsonFormsStore => {
  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        data,
        schema,
        uischema
      },
      ...props
    }
  };
  const reducer = combineReducers({ jsonforms: jsonformsReducer() });
  return createStore(reducer, initState);
};

const CustomRenderer1: StatelessRenderer<RendererProps> = () => <h1>test</h1>;
const CustomRenderer2: StatelessRenderer<RendererProps> = () => <h2>test</h2>;
const CustomRenderer3: StatelessRenderer<RendererProps> = () => <h3>test</h3>;

test('JsonForms renderer should pick most applicable renderer via ownProps', async () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema,
    schema: fixture.schema
  });
  store.dispatch(registerRenderer(async () => 10, CustomRenderer1));
  store.dispatch(registerRenderer(async () => 5, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch
          uischema={fixture.uischema}
          schema={fixture.schema}
          renderers={[{ tester: async () => 3, renderer: CustomRenderer3 }]}
        />
      </JsonFormsReduxContext>
    </Provider>
  );

  await (act(async () => wrapper.find(JsonFormsDispatchRenderer).state('renderer') !== undefined));
  wrapper.update();
  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});
