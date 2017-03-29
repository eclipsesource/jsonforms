import {test} from 'ava';
import {RendererService, RendererTester} from '../src/core/renderer.service';
import {DataService} from '../src/core/data.service';
import {UISchemaElement, ControlElement} from '../src/models/uischema';
import {JsonSchema} from '../src/models/jsonSchema';
import {Renderer} from '../src/core/renderer';

import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');

test.before(t => {
  // global.HTMLElement = () => {};
  function Renderer1() {
    // return Reflect.construct(HTMLElement, [], Renderer1);
    return HTMLElement.apply(this, []);
  }
  Object.setPrototypeOf(Renderer1.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer1, HTMLElement);
  Renderer1.prototype.setUiSchema = function(){/*Do nothing*/};
  Renderer1.prototype.setDataService = function(){/*Do nothing*/};
  Renderer1.prototype.setDataSchema = function(){/*Do nothing*/};
  customElements.define('custom-renderer1', Renderer1);

  function Renderer2() {
    // return Reflect.construct(HTMLElement, [], Renderer2);
    return HTMLElement.apply(this, []);
  }
  Object.setPrototypeOf(Renderer2.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer2, HTMLElement);
  Renderer2.prototype.setUiSchema = function(){/*Do nothing*/};
  Renderer2.prototype.setDataService = function(){/*Do nothing*/};
  Renderer2.prototype.setDataSchema = function(){/*Do nothing*/};
  customElements.define('custom-renderer2', Renderer2);
});

test('RendererService no renderer', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uischema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  const element = rendererService.getBestRenderer(uischema, schema, dataService);
  t.deepEqual(element.outerHTML,
    '<label>Unknown Schema: {"type":"Control","scope":{"$ref":"#/properties/foo"}}</label>');
});
test('RendererService highest registered renderer used', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uischema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  rendererService.registerRenderer(() => 10, 'custom-renderer1');
  rendererService.registerRenderer(() => 5, 'custom-renderer2');
  const element = rendererService.getBestRenderer(uischema, schema, dataService);
  t.deepEqual(element.outerHTML, '<custom-renderer1></custom-renderer1>');
});
test('RendererService unregistered renderer not used', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uischema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  rendererService.registerRenderer(() => 10, 'custom-renderer1');
  rendererService.registerRenderer(() => 5, 'custom-renderer2');
  rendererService.unregisterRenderer(() => 10, 'custom-renderer1');
  const element = rendererService.getBestRenderer(uischema, schema, dataService);
  t.deepEqual(element.outerHTML, '<custom-renderer2></custom-renderer2>');
});
test('RendererService unregister not registered renderer ', t => {
  const rendererService = new RendererService();
  const tester1 = () => 10;
  const renderer1 = 'custom-renderer1';
  rendererService.unregisterRenderer(tester1, renderer1);
  t.pass();
});
