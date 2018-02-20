import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);

import * as React from 'react';
import { test } from 'ava';
import * as _ from 'lodash';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  jsonformsReducer,
  JsonFormsStore,
  JsonSchema,
  registerRenderer,
  RendererProps,
  UISchemaElement,
  unregisterRenderer
} from '@jsonforms/core';
import * as TestUtils from 'react-dom/test-utils';

import { JsonForms, StatelessRenderer } from '../../src';

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
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
});

test('JsonForms renderer should report about missing renderer', t => {
  const data = { foo: 'John Doe' };
  const uischema = { type: 'Foo' };
  const schema: JsonSchema = { type: 'object', properties: { foo: { type: 'string'} } };
  const store = initJsonFormsStore({
    data,
    schema,
    uischema
  });

  const div = _.head(
    TestUtils.scryRenderedDOMComponentsWithTag(
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <JsonForms uischema={uischema} schema={schema} />
        </Provider>
      ),
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
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  );

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
  const tree = TestUtils.renderIntoDocument(
  <Provider store={store}>
    <JsonForms uischema={t.context.uischema} schema={t.context.schema}/>
  </Provider>
);

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
