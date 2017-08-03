"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const data_service_1 = require("../src/core/data.service");
const renderer_service_1 = require("../src/core/renderer.service");
require("./helpers/setup");
ava_1.test.before(t => {
    function Renderer1() {
        /*tslint:disable:no-invalid-this */
        return HTMLElement.apply(this, []);
        /*tslint:enable:no-invalid-this */
    }
    Object.setPrototypeOf(Renderer1.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(Renderer1, HTMLElement);
    Renderer1.prototype.setUiSchema = () => { };
    Renderer1.prototype.setDataService = () => { };
    Renderer1.prototype.setDataSchema = () => { };
    customElements.define('custom-renderer1', Renderer1);
    function Renderer2() {
        /*tslint:disable:no-invalid-this */
        return HTMLElement.apply(this, []);
        /*tslint:enable:no-invalid-this */
    }
    Object.setPrototypeOf(Renderer2.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(Renderer2, HTMLElement);
    Renderer2.prototype.setUiSchema = () => { };
    Renderer2.prototype.setDataService = () => { };
    Renderer2.prototype.setDataSchema = () => { };
    customElements.define('custom-renderer2', Renderer2);
});
ava_1.test('findMostApplicableRenderer should report about missing renderer', t => {
    const rendererService = new renderer_service_1.RendererService();
    const data = { foo: 'John Doe' };
    const dataService = new data_service_1.DataService(data);
    const uiSchema = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    const schema = { type: 'object', properties: { foo: { type: 'string' } } };
    const element = rendererService.findMostApplicableRenderer(uiSchema, schema, dataService);
    t.is(element.outerHTML, '<label>Unknown Schema: {"type":"Control","scope":{"$ref":"#/properties/foo"}}</label>');
});
ava_1.test('findMostApplicableRenderer should pick most applicable renderer', t => {
    const rendererService = new renderer_service_1.RendererService();
    const data = { foo: 'John Doe' };
    const dataService = new data_service_1.DataService(data);
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const schema = {
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
ava_1.test('findMostApplicableRenderer should not consider any de-registered renderers', t => {
    const rendererService = new renderer_service_1.RendererService();
    const data = { foo: 'John Doe' };
    const dataService = new data_service_1.DataService(data);
    const uiSchema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    const schema = {
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
ava_1.test('deregisterRenderer should be a no-op if given an unregistered renderer ', t => {
    const rendererService = new renderer_service_1.RendererService();
    rendererService.registerRenderer(() => 10, 'custom-renderer1');
    rendererService.registerRenderer(() => 5, 'custom-renderer2');
    const tester = () => 10;
    const renderer = 'custom-renderer3';
    rendererService.deregisterRenderer(tester, renderer);
    /*tslint:disable:no-string-literal */
    t.is(rendererService['renderers'].length, 2);
    /*tslint:enable:no-string-literal */
});
//# sourceMappingURL=renderer.service.test.js.map