/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import 'jsdom-global/register';

import * as React from 'react';
import { test } from 'ava';
import * as _ from 'lodash';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  jsonformsReducer,
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
import * as TestUtils from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';
import { JsonForms } from '../../src/JsonForms';
import { StatelessRenderer } from '../../src/Renderer';

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

export const initJsonFormsStore = ({
  data,
  schema,
  uischema,
  ...props
}: JsonFormsInitialState): JsonFormsStore => {
  return createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        core: {
          data,
          schema,
          uischema
        },
        ...props
      }
    }
  );
};

const CustomRenderer1: StatelessRenderer<RendererProps> = () => (<h1>test</h1>);
const CustomRenderer2: StatelessRenderer<RendererProps> = () => (<h2>test</h2>);
const CustomRenderer3: StatelessRenderer<RendererProps> = () => (<h3>test</h3>);

test.beforeEach(t => {
  t.context.data = { foo: 'John Doe' };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.context.uischema2 = {
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
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
  t.context.container = document.createElement('div');
});

test.afterEach(t => {
  ReactDOM.unmountComponentAtNode(t.context.container);
});

test('JsonForms renderer should report about missing renderer', t => {
  const data = { foo: 'John Doe' };
  const uischema = { type: 'Foo' };
  const schema: JsonSchema = { type: 'object', properties: { foo: { type: 'string' } } };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema
  });

  const component = (
    <Provider store={store}>
      <JsonForms uischema={uischema} schema={schema} />
    </Provider>
  );
  const tree = ReactDOM.render(component, t.context.container);

  const div = _.head(
    TestUtils.scryRenderedDOMComponentsWithTag(
      tree,
      'div'
    )
  ) as HTMLDivElement;
  t.is(div.textContent, 'No applicable renderer found.');
});

test('JsonForms renderer should pick most applicable renderer', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer1));
  const component = (
    <Provider store={store}>
      <JsonForms uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  );
  const tree = ReactDOM.render(component, t.context.container);

  t.not(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1'), undefined);
});

test('JsonForms renderer should not consider any de-registered renderers', t => {
  const tester1 = () => 9;
  const tester2 = () => 8;
  const tester3 = () => 10;
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  store.dispatch(registerRenderer(tester1, CustomRenderer1));
  store.dispatch(registerRenderer(tester2, CustomRenderer2));
  store.dispatch(registerRenderer(tester3, CustomRenderer3));
  store.dispatch(unregisterRenderer(tester3, CustomRenderer2));
  const component = (
    <Provider store={store}>
      <JsonForms uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  );
  const tree = ReactDOM.render(component, t.context.container);

  t.not(TestUtils.findRenderedDOMComponentWithTag(tree, 'h1'), undefined);
});

test('deregister an unregistered renderer should be a no-op', t => {
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const tester = () => 10;
  const nrOfRenderers = store.getState().jsonforms.renderers.length;
  store.dispatch(unregisterRenderer(tester, CustomRenderer3));
  t.is(store.getState().jsonforms.renderers.length, nrOfRenderers);
});

test('ids should be unique within the same form', t => {

  const FakeLayout = (props: RendererProps) => {
    const { uischema, schema, path } = props;
    const layout = uischema as Layout;
    const children = layout.elements.map((e, idx) => (
      <JsonForms
        uischema={e}
        schema={schema}
        path={path}
        key={`${path}-${idx}`}
      />)
    );
    return (
      <div className='layout'>
        {children}
      </div>
    );
  };

  const store = initJsonFormsStore(
    {
      data: t.context.data,
      schema: t.context.schema,
      uischema: t.context.uischema2,
      renderers: [{
        tester: rankWith(10, uiTypeIs('HorizontalLayout')),
        renderer: FakeLayout
      }]
    }
  );

  const ids = [];
  const MyCustomRenderer: StatelessRenderer<any> = props => {
    ids.push(props.id);
    return (<div>Custom</div>);
  };
  store.dispatch(registerRenderer(() => 10, MyCustomRenderer));

  ReactDOM.render(
    <Provider store={store}>
      <JsonForms uischema={t.context.uischema2} schema={t.context.schema} />
    </Provider>,
    t.context.container
  );

  t.is(
    ids.indexOf('#/properties/foo') > -1,
    true,
    'Generated DOM should contain id: ' + '#/properties/foo'
  );
  t.is(
    ids.indexOf('#/properties/foo2') > -1,
    true,
    'Generated DOM should contain id: ' + '#/properties/foo2'
  );
});
