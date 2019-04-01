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
import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  jsonformsReducer, JsonFormsState,
  JsonFormsStore,
  JsonSchema,
  Layout,
  rankWith,
  registerRenderer,
  RendererProps,
  UISchemaElement,
  uiTypeIs,
  unregisterRenderer
} from '@jsonforms/core';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import { StatelessRenderer } from '../../src/Renderer';
import RefParser from 'json-schema-ref-parser';

import Adapter from 'enzyme-adapter-react-16';
import { JsonForms, JsonFormsDispatchRenderer } from '../../src/JsonForms';

Enzyme.configure({ adapter: new Adapter() });

/**
 * Describes the initial state of the JSON Form's store.
 */
export interface JsonFormsInitialState {
  /**
   * Data instance to be rendered.
   */
  data: any;

  /**
   * JSON Schema describing the data to be rendered.
   */
  schema?: JsonSchema;

  /**
   * UI Schema describing the UI to be rendered.
   */
  uischema?: UISchemaElement;

  /**
   * Any additional state.
   */
  [x: string]: any;
}

export const initJsonFormsStore = (
  {
    data,
    schema,
    uischema,
    ...props
  }: JsonFormsInitialState
): JsonFormsStore => {
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
  return createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    initState
  );
};

const CustomRenderer1: StatelessRenderer<RendererProps> = () => (<h1>test</h1>);
const CustomRenderer2: StatelessRenderer<RendererProps> = () => (<h2>test</h2>);
const CustomRenderer3: StatelessRenderer<RendererProps> = () => (<h3>test</h3>);

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

test('JsonForms renderer should report about missing renderer', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });

  const wrapper = mount(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  );

  expect(wrapper.text()).toContain('No applicable renderer found');
  wrapper.unmount();
});

test('JsonForms renderer should pick most applicable renderer', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonForms uischema={fixture.uischema} schema={fixture.schema} />
    </Provider>
  );

  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should not consider any de-registered renderers', () => {
  const tester1 = () => 9;
  const tester2 = () => 8;
  const tester3 = () => 10;
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(tester1, CustomRenderer1));
  store.dispatch(registerRenderer(tester2, CustomRenderer2));
  store.dispatch(registerRenderer(tester3, CustomRenderer3));
  store.dispatch(unregisterRenderer(tester3, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  );

  expect(wrapper.find('h1')).toBeDefined();
  wrapper.unmount();
});

test('deregister an unregistered renderer should be a no-op', () => {
  const store = initJsonFormsStore(fixture);
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const tester = () => 10;
  const nrOfRenderers = store.getState().jsonforms.renderers.length;
  store.dispatch(unregisterRenderer(tester, CustomRenderer3));
  expect(store.getState().jsonforms.renderers.length).toBe(nrOfRenderers);
});

test('ids should be unique within the same form', () => {

  const FakeLayout = (props: RendererProps) => {
    const layout = props.uischema as Layout;
    const children = layout.elements.map((e, idx) => (
      <JsonForms
        uischema={e}
        schema={fixture.schema}
        path={props.path}
        key={`${props.path}-${idx}`}
      />)
    );
    return (
      <div className='layout'>
        {children}
      </div>
    );
  };

  const uischema2 = {
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      },
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };

  const store = initJsonFormsStore(
    {
      data: fixture.data,
      schema: fixture.schema,
      uischema: uischema2,
      renderers: [{
        tester: rankWith(10, uiTypeIs('HorizontalLayout')),
        renderer: FakeLayout
      }]
    }
  );

  const ids: string[] = [];
  const MyCustomRenderer: StatelessRenderer<any> = props => {
    ids.push(props.id);
    return (<div>Custom</div>);
  };
  store.dispatch(registerRenderer(() => 10, MyCustomRenderer));

  const wrapper = mount(
    <Provider store={store}>
      <JsonForms uischema={uischema2} schema={fixture.schema} />
    </Provider>,
  );

  expect(ids.indexOf('#/properties/foo') > -1).toBeTruthy();
  expect(ids.indexOf('#/properties/foo2') > -1).toBeTruthy();
  wrapper.unmount();
});

test('render schema with $ref', () => {

  const schemaWithRef = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        $ref: '#/definitions/n'
      }
    }
  };
  const resolvedSchema = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  } as JsonSchema;

  const tester = (_uischema: UISchemaElement, s: JsonSchema) => s.properties.foo.type === 'number' ? 1 : -1;

  const renderers = [{
    tester: tester,
    renderer: CustomRenderer2
  }];

  const promise = Promise.resolve(resolvedSchema);
  jest.spyOn(RefParser, 'dereference').mockImplementation(() => promise);

  const wrapper = shallow(
    <JsonFormsDispatchRenderer
      path={''}
      uischema={fixture.uischema}
      schema={schemaWithRef}
      renderers={renderers}
      rootSchema={resolvedSchema}
      refResolver={() => promise}
    />
  );

  return promise.then(() => {
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('resolving', false);
    expect(wrapper.find(CustomRenderer2).length).toBe(1);
    wrapper.unmount();
  });
});

test.skip('updates schema with ref', () => {

  const schemaWithRef = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        $ref: '#/definitions/n'
      }
    }
  };
  const resolvedSchema = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  };

  const tester1 = (_uischema: UISchemaElement, s: JsonSchema) => s.properties.foo.type === 'string' ? 1 : -1;
  const tester2 = (_uischema: UISchemaElement, s: JsonSchema) => s.properties.foo.type === 'number' ? 1 : -1;

  const renderers = [{
    tester: tester1,
    renderer: CustomRenderer1
  }, {
    tester: tester2,
    renderer: CustomRenderer2
  }];

  const promise = Promise.resolve(resolvedSchema);
  jest.spyOn(RefParser, 'dereference').mockImplementation(() => promise);

  const wrapper = shallow(
    <JsonFormsDispatchRenderer
      path={''}
      uischema={fixture.uischema}
      schema={fixture.schema}
      renderers={renderers}
      rootSchema={resolvedSchema}
      refResolver={() => promise}
    />
  );
  expect(wrapper.find(CustomRenderer1).length).toBe(1);

  wrapper.setProps({ schema: schemaWithRef }
  );

  return promise.then(() => {
    wrapper.update();
    expect(wrapper.state()).toHaveProperty('resolving', false);
    expect(wrapper.find(CustomRenderer2).length).toBe(1);
    wrapper.unmount();
  });
});

test('JsonForms renderer should pick most applicable renderer via ownProps', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonForms
        uischema={fixture.uischema}
        schema={fixture.schema}
        renderers={[{ tester: () => 3, renderer: CustomRenderer3 }]}
      />
    </Provider>
  );

  expect(wrapper.find('h3').text()).toBe('test');
  wrapper.unmount();
});