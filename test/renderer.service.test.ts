import { test } from 'ava';
import { DataService } from '../src/core/data.service';
import { RendererService } from '../src/core/renderer.service';
import { JsonSchema } from '../src/models/jsonSchema';
import { ControlElement } from '../src/models/uischema';

import './helpers/setup';

test.before(t => {
  function Renderer1() {
    /*tslint:disable:no-invalid-this */
    return HTMLElement.apply(this, []);
    /*tslint:enable:no-invalid-this */
  }
  Object.setPrototypeOf(Renderer1.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer1, HTMLElement);
  Renderer1.prototype.setUiSchema = () => { /* nop */ };
  Renderer1.prototype.setDataService = () => { /* nop */ };
  Renderer1.prototype.setDataSchema = () => { /* nop */ };
  customElements.define('custom-renderer1', Renderer1);

  function Renderer2() {
    /*tslint:disable:no-invalid-this */
    return HTMLElement.apply(this, []);
    /*tslint:enable:no-invalid-this */
  }
  Object.setPrototypeOf(Renderer2.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(Renderer2, HTMLElement);
  Renderer2.prototype.setUiSchema = () => { /* nop */ };
  Renderer2.prototype.setDataService = () => { /* nop */ };
  Renderer2.prototype.setDataSchema = () => { /* nop */ };
  customElements.define('custom-renderer2', Renderer2);
});

test('findMostApplicableRenderer should report about missing renderer', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema: ControlElement = {type: 'Control', scope: {$ref: '#/properties/foo'}};
  const schema: JsonSchema = {type: 'object', properties: {foo: {type: 'string'}}};
  const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
  t.is(element.outerHTML,
       '<label>Unknown Schema: {"type":"Control","scope":{"$ref":"#/properties/foo"}}</label>');
});

test('findMostApplicableRenderer should pick most applicable renderer', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
  rendererService.registerRenderer(() => 10, 'custom-renderer1');
  rendererService.registerRenderer(() => 5, 'custom-renderer2');
  const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
  t.is(element.outerHTML, '<custom-renderer1></custom-renderer1>');
});
test('findMostApplicableRenderer should not consider any de-registered renderers', t => {
  const rendererService = new RendererService();
  const data = {foo: 'John Doe'};
  const dataService = new DataService(data);
  const uiSchema: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo'
    }
  };
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
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
  /*tslint:disable:no-string-literal */
  t.is(rendererService['renderers'].length, 2);
  /*tslint:enable:no-string-literal */
});
