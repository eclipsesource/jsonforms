"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
// inject window, document etc.
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global, 'force');
var vertical_layout_1 = require("../src/renderers/layouts/vertical.layout");
ava_1.default('VerticalLayoutRendererTester', function (t) {
    t.is(-1, vertical_layout_1.VerticalLayoutRendererTester(undefined));
    t.is(-1, vertical_layout_1.VerticalLayoutRendererTester(null));
    t.is(-1, vertical_layout_1.VerticalLayoutRendererTester({ type: 'Foo' }));
    t.is(1, vertical_layout_1.VerticalLayoutRendererTester({ type: 'VerticalLayout' }));
});
ava_1.default('VerticalLayoutRenderer with elements undefined', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    renderer.setUiSchema({ type: 'VerticalLayout' });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 0);
});
ava_1.default('VerticalLayoutRenderer with elements null', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    renderer.setUiSchema({ type: 'VerticalLayout', elements: null });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 0);
});
ava_1.default('VerticalLayoutRenderer with Children', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    renderer.setUiSchema({ type: 'VerticalLayout',
        elements: [{ type: 'Control' }, { type: 'Control' }] });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 2);
});
ava_1.default('VerticalLayoutRenderer notify visible', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    var verticalLayout = { type: 'VerticalLayout', elements: [{ type: 'Control' }] };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    var runtime = verticalLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('VerticalLayoutRenderer notify disabled', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    var verticalLayout = { type: 'VerticalLayout', elements: [{ type: 'Control' }] };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    var runtime = verticalLayout['runtime'];
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('VerticalLayoutRenderer notify enabled', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    var verticalLayout = { type: 'VerticalLayout', elements: [{ type: 'Control' }] };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    var runtime = verticalLayout['runtime'];
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('VerticalLayoutRenderer disconnected no notify visible', function (t) {
    var renderer = new vertical_layout_1.VerticalLayoutRenderer();
    var verticalLayout = { type: 'VerticalLayout', elements: [{ type: 'Control' }] };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    var runtime = verticalLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=vertical.layout.test.js.map