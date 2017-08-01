import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { Runtime } from '../../src/core/runtime';
import { JsonForms } from '../../src/core';
import { LabelElement, UISchemaElement } from '../../src/models/uischema';
import { LabelRenderer, labelRendererTester } from '../../src/renderers/additional/label.renderer';
import {
  testHide,
  testNotifyAboutVisibiltyWhenDisconnected,
  testShow
} from './base.control.tests';
test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'label-control',
      classNames: ['jsf-label']
    }
  ]);
});
test.beforeEach(t => {
  t.context.data =  {'name': 'Foo'};
  t.context.schema = {type: 'object', properties: {name: {type: 'string'}}};
  t.context.uiSchema = {type: 'Label', text: 'Bar'};
});

test('Label tester', t => {
  t.is(
      labelRendererTester(undefined, undefined),
      -1
  );
  t.is(
      labelRendererTester(null, undefined),
      -1
  );
  t.is(
      labelRendererTester({type: 'Foo'}, undefined),
      -1
  );
  t.is(
      labelRendererTester({type: 'Label'}, undefined),
      1
  );
});

test('Render Label with static undefined text', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  const uiSchema: UISchemaElement = {
    type: 'Label'
  };
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.className, 'jsf-label');
  t.is(result.childNodes.length, 0);
  t.is(result.textContent, '');
});

test('Render Label with static null text', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  const uiSchema: LabelElement = {
    type: 'Label',
    text: null
  };
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(uiSchema);
  const result = renderer.render();
  t.is(result.className, 'jsf-label');
  t.is(result.childNodes.length, 0);
  t.is(result.textContent, '');
});

test('Render Label with static text', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  renderer.setDataService(new DataService(t.context.data));
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(t.context.uiSchema);
  const result = renderer.render();
  t.is(result.className, 'jsf-label');
  t.is(result.childNodes.length, 1);
  t.is(result.textContent, 'Bar');
});

test('Hide Label', t => {
  testHide(t, new LabelRenderer());
});

test('Show Label', t => {
  testShow(t, new LabelRenderer());
});

test('Disable Label', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  const labelElement: LabelElement = {
    type: 'Label',
    text: 'Bar'
  };
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(labelElement);
  renderer.connectedCallback();
  const runtime: Runtime = labelElement.runtime;
  runtime.enabled = false;
  t.is(renderer.getAttribute('disabled'), 'true');
});

test('Enable Label', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  const labelElement: LabelElement = {
    type: 'Label',
    text: 'Bar'
  };
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(labelElement);
  renderer.connectedCallback();
  const runtime: Runtime = labelElement.runtime;
  runtime.enabled = true;
  t.false(renderer.hasAttribute('disabled'));
});

test('Label should not be hidden if disconnected', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new LabelRenderer());
});

test('Label should not be disabled if disconnected', t => {
  const renderer: LabelRenderer = new LabelRenderer();
  const labelElement: LabelElement = {
    type: 'Label',
    text: 'Bar'
  };
  const dataService = new DataService(t.context.data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(t.context.schema);
  renderer.setUiSchema(labelElement);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = labelElement.runtime;
  runtime.enabled = false;
  t.false(renderer.hasAttribute('disabled'));
});
