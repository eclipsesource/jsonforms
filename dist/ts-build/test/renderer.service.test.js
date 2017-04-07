"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var renderer_service_1 = require("../src/core/renderer.service");
var data_service_1 = require("../src/core/data.service");
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global, 'force');
ava_1.test.before(function (t) {
    function Renderer1() {
        return HTMLElement.apply(this, []);
    }
    Object.setPrototypeOf(Renderer1.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(Renderer1, HTMLElement);
    Renderer1.prototype.setUiSchema = function () { };
    Renderer1.prototype.setDataService = function () { };
    Renderer1.prototype.setDataSchema = function () { };
    customElements.define('custom-renderer1', Renderer1);
    function Renderer2() {
        return HTMLElement.apply(this, []);
    }
    Object.setPrototypeOf(Renderer2.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(Renderer2, HTMLElement);
    Renderer2.prototype.setUiSchema = function () { };
    Renderer2.prototype.setDataService = function () { };
    Renderer2.prototype.setDataSchema = function () { };
    customElements.define('custom-renderer2', Renderer2);
});
ava_1.test('RendererService no renderer', function (t) {
    var rendererService = new renderer_service_1.RendererService();
    var data = { foo: 'John Doe' };
    var dataService = new data_service_1.DataService(data);
    var uischema = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    var schema = { type: 'object', properties: { foo: { type: 'string' } } };
    var element = rendererService.getBestRenderer(uischema, schema, dataService);
    t.deepEqual(element.outerHTML, '<label>Unknown Schema: {"type":"Control","scope":{"$ref":"#/properties/foo"}}</label>');
});
ava_1.test('RendererService highest registered renderer used', function (t) {
    var rendererService = new renderer_service_1.RendererService();
    var data = { foo: 'John Doe' };
    var dataService = new data_service_1.DataService(data);
    var uischema = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    var schema = { type: 'object', properties: { foo: { type: 'string' } } };
    rendererService.registerRenderer(function () { return 10; }, 'custom-renderer1');
    rendererService.registerRenderer(function () { return 5; }, 'custom-renderer2');
    var element = rendererService.getBestRenderer(uischema, schema, dataService);
    t.deepEqual(element.outerHTML, '<custom-renderer1></custom-renderer1>');
});
ava_1.test('RendererService unregistered renderer not used', function (t) {
    var rendererService = new renderer_service_1.RendererService();
    var data = { foo: 'John Doe' };
    var dataService = new data_service_1.DataService(data);
    var uischema = { type: 'Control', scope: { $ref: '#/properties/foo' } };
    var schema = { type: 'object', properties: { foo: { type: 'string' } } };
    var tester1 = function () { return 5; };
    var tester2 = function () { return 8; };
    var tester3 = function () { return 10; };
    rendererService.registerRenderer(tester1, 'custom-renderer1');
    rendererService.registerRenderer(tester2, 'custom-renderer2');
    rendererService.registerRenderer(tester3, 'custom-renderer2');
    rendererService.unregisterRenderer(tester3, 'custom-renderer2');
    var element = rendererService.getBestRenderer(uischema, schema, dataService);
    // tester2 should be triggered
    t.deepEqual(element.outerHTML, '<custom-renderer2></custom-renderer2>');
});
ava_1.test('RendererService unregister not registered renderer ', function (t) {
    var rendererService = new renderer_service_1.RendererService();
    rendererService.registerRenderer(function () { return 10; }, 'custom-renderer1');
    rendererService.registerRenderer(function () { return 5; }, 'custom-renderer2');
    var tester = function () { return 10; };
    var renderer = 'custom-renderer3';
    rendererService.unregisterRenderer(tester, renderer);
    t.is(rendererService['renderers'].length, 2);
});
//# sourceMappingURL=renderer.service.test.js.map