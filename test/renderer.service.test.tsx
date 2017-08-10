import { test } from 'ava';
import * as _ from 'lodash';
import { JsonSchema } from '../src/models/jsonSchema';
import { initJsonFormsStore } from './helpers/setup';
import { Renderer } from '../src/core/renderer';
import {
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from 'inferno-test-utils';
import { DispatchRenderer } from '../src/renderers/dispatch.renderer';
import { Provider } from 'inferno-redux';
import { JsonForms } from '../src/core';

class CustomRenderer1 extends Renderer {
  render() {
    return (<h1>test</h1>);
  }
}

class CustomRenderer2 extends Renderer {
  render() {
    return (<h2>test</h2>);
  }
}

class CustomRenderer3 extends Renderer {
  render() {
    return (<h3>test</h3>);
  }
}

test.beforeEach(t => {
  t.context.data = { foo: 'John Doe' };
  t.context.uischema = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
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

test('DispatchRenderer should report about missing renderer', t => {
  const data = { foo: 'John Doe' };
  const uischema = { type: 'Foo' };
  const schema: JsonSchema = { type: 'object', properties: { foo: { type: 'string'} } };
  const store = initJsonFormsStore(data, schema, uischema);
  const div = _.head(
    scryRenderedDOMElementsWithTag(
      renderIntoDocument(
        <Provider store={store}>
          <DispatchRenderer uischema={uischema} schema={schema} />
        </Provider>
      ),
      'div'
    )
  );
  t.is(div.textContent, 'No applicable renderer found.');
});

test('DispatchRenderer should pick most applicable renderer', t => {
  JsonForms.rendererService.registerRenderer(() => 10, CustomRenderer1);
  JsonForms.rendererService.registerRenderer(() => 5, CustomRenderer2);
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  );

  t.not(findRenderedDOMElementWithTag(tree, 'h1'), undefined);
});
test('Dispatch renderer should not consider any de-registered renderers', t => {
  const tester1 = () => 9;
  const tester2 = () => 8;
  const tester3 = () => 10;
  JsonForms.rendererService.registerRenderer(tester1, CustomRenderer1);
  JsonForms.rendererService.registerRenderer(tester2, CustomRenderer2);
  JsonForms.rendererService.registerRenderer(tester3, CustomRenderer2);
  JsonForms.rendererService.deregisterRenderer(tester3, CustomRenderer2);
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <DispatchRenderer uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  );

  t.not(findRenderedDOMElementWithTag(tree, 'h1'), undefined);
});

test('deregister an unregistered renderer should be a no-op', t => {
  JsonForms.rendererService.registerRenderer(() => 10, CustomRenderer1);
  JsonForms.rendererService.registerRenderer(() => 5, CustomRenderer2);
  const tester = () => 10;
  const renderers = JsonForms.rendererService.renderers.length;
  JsonForms.rendererService.deregisterRenderer(tester, CustomRenderer3);
  t.is(JsonForms.rendererService.renderers.length, renderers);
});
