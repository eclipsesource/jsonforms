"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
// inject window, document etc.
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global, 'force');
var horizontal_layout_1 = require("../src/renderers/layouts/horizontal.layout");
ava_1.default('HorizontalLayoutRendererTester', function (t) {
    t.is(-1, horizontal_layout_1.HorizontalLayoutRendererTester(undefined));
    t.is(-1, horizontal_layout_1.HorizontalLayoutRendererTester(null));
    t.is(-1, horizontal_layout_1.HorizontalLayoutRendererTester({ type: 'Foo' }));
    t.is(1, horizontal_layout_1.HorizontalLayoutRendererTester({ type: 'HorizontalLayout' }));
});
ava_1.default('HorizontalLayoutRenderer with elements undefined', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema({ type: 'HorizontalLayout' });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 0);
});
ava_1.default('HorizontalLayoutRenderer with elements null', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema({ type: 'HorizontalLayout', elements: null });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 0);
});
ava_1.default('HorizontalLayoutRenderer with Children', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema({ type: 'HorizontalLayout',
        elements: [{ type: 'Control' }, { type: 'Control' }] });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 2);
});
ava_1.default('HorizontalLayoutRenderer notify visible', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    var horizontalLayout = { type: 'HorizontalLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(horizontalLayout);
    renderer.connectedCallback();
    var runtime = horizontalLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('HorizontalLayoutRenderer notify disabled', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    var horizontalLayout = { type: 'HorizontalLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(horizontalLayout);
    renderer.connectedCallback();
    var runtime = horizontalLayout['runtime'];
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('HorizontalLayoutRenderer notify enabled', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    var horizontalLayout = { type: 'HorizontalLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(horizontalLayout);
    renderer.connectedCallback();
    var runtime = horizontalLayout['runtime'];
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('HorizontalLayoutRenderer disconnected no notify visible', function (t) {
    var renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    var horizontalLayout = { type: 'HorizontalLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(horizontalLayout);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    var runtime = horizontalLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=horizontal.layout.test.js.map