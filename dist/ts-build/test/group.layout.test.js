"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
// inject window, document etc.
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global, 'force');
var group_layout_1 = require("../src/renderers/layouts/group.layout");
ava_1.default('GroupLayoutRendererTester', function (t) {
    t.is(-1, group_layout_1.GroupLayoutRendererTester(undefined));
    t.is(-1, group_layout_1.GroupLayoutRendererTester(null));
    t.is(-1, group_layout_1.GroupLayoutRendererTester({ type: 'Foo' }));
    t.is(1, group_layout_1.GroupLayoutRendererTester({ type: 'Group' }));
});
ava_1.default('GroupLayoutRenderer with elements undefined', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema({ type: 'GroupLayout' });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 0);
});
ava_1.default('GroupLayoutRenderer with label', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema({ type: 'GroupLayout', label: 'Foo' });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 1);
    var legend = div.children[0];
    t.is(legend.tagName, 'LEGEND');
    t.is(legend['innerText'], 'Foo');
});
ava_1.default('GroupLayoutRenderer with elements null', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema({ type: 'GroupLayout', elements: null });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 0);
});
ava_1.default('GroupLayoutRenderer with Children', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema({ type: 'GroupLayout',
        elements: [{ type: 'Control' }, { type: 'Control' }] });
    var result = renderer.render();
    t.is(result.childNodes.length, 1);
    var div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 2);
});
ava_1.default('GroupLayoutRenderer notify visible', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    var groupLayout = { type: 'GroupLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(groupLayout);
    renderer.connectedCallback();
    var runtime = groupLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('GroupLayoutRenderer notify disabled', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    var groupLayout = { type: 'GroupLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(groupLayout);
    renderer.connectedCallback();
    var runtime = groupLayout['runtime'];
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('GroupLayoutRenderer notify enabled', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    var groupLayout = { type: 'GroupLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(groupLayout);
    renderer.connectedCallback();
    var runtime = groupLayout['runtime'];
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('GroupLayoutRenderer disconnected no notify visible', function (t) {
    var renderer = new group_layout_1.GroupLayoutRenderer();
    var groupLayout = { type: 'GroupLayout',
        elements: [{ type: 'Control' }] };
    renderer.setUiSchema(groupLayout);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    var runtime = groupLayout['runtime'];
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    var div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=group.layout.test.js.map