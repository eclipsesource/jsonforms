import {test} from 'ava';
import {RendererService} from '../src/core/renderer.service';
import {DataService} from '../src/core/data.service';
import {ControlElement} from '../src/models/uischema';
import {JsonSchema} from '../src/models/jsonSchema';

import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');

test.before(t => {
  function Renderer1() {
    return HTMLElement.apply(this, []);
  }
  Object.setPrototypeOf(Renderer1.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer1, HTMLElement);
  Renderer1.prototype.setUiSchema = function(){/*Do nothing*/};
  Renderer1.prototype.setDataService = function(){/*Do nothing*/};
  Renderer1.prototype.setDataSchema = function(){/*Do nothing*/};
  customElements.define('custom-renderer1', Renderer1);

  function Renderer2() {
    return HTMLElement.apply(this, []);
  }
  Object.setPrototypeOf(Renderer2.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer2, HTMLElement);
  Renderer2.prototype.setUiSchema = function(){/*Do nothing*/};
  Renderer2.prototype.setDataService = function(){/*Do nothing*/};
  Renderer2.prototype.setDataSchema = function(){/*Do nothing*/};
  customElements.define('custom-renderer2', Renderer2);
});

test('findMostApplicableRenderer should report about missing renderer', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
  t.is(element.outerHTML,
    '<label>Unknown Schema: {"type":"Control","scope":{"$ref":"#/properties/foo"}}</label>');
});
test('findMostApplicableRenderer should pick most applicable renderer', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  rendererService.registerRenderer(() => 10, 'custom-renderer1');
  rendererService.registerRenderer(() => 5, 'custom-renderer2');
  const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
  t.is(element.outerHTML, '<custom-renderer1></custom-renderer1>');
});
test('findMostApplicableRenderer should not consider any de-registered renderers', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema = {type: 'Control', scope: {$ref: '#/properties/foo'}} as ControlElement;
  const schema = {type: 'object', properties: {foo: {type: 'string'}}} as JsonSchema;
  const tester1 = () => 5;
  const tester2 = () => 8;
  const tester3 = () => 10;
  rendererService.registerRenderer(tester1, 'custom-renderer1');
  rendererService.registerRenderer(tester2, 'custom-renderer2');
  rendererService.registerRenderer(tester3, 'custom-renderer2');
  rendererService.deregisterRenderer(tester3, 'custom-renderer2');
  const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
  // tester2 should be triggered
  t.is(element.outerHTML, '<custom-renderer2></custom-renderer2>');
});
test('deregisterRenderer should be a no-op if given an unregistered renderer ', t => {
  const rendererService = new RendererService();
  rendererService.registerRenderer(() => 10, 'custom-renderer1');
  rendererService.registerRenderer(() => 5, 'custom-renderer2');
  const tester = () => 10;
  const renderer = 'custom-renderer3';
  rendererService.deregisterRenderer(tester, renderer);
  t.is(rendererService['renderers'].length, 2);
});
