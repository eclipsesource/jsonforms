"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const vertical_layout_1 = require("../../src/renderers/layouts/vertical.layout");
ava_1.default('VerticalLayout tester', t => {
    t.is(vertical_layout_1.verticalLayoutTester(undefined, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester(null, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester({ type: 'Foo' }, undefined), -1);
    t.is(vertical_layout_1.verticalLayoutTester({ type: 'VerticalLayout' }, undefined), 1);
});
ava_1.default('Render VerticalLayout with undefined elements', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const uiSchema = {
        type: 'VerticalLayout',
        elements: []
    };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render VerticalLayout with null elements', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const uiSchema = { type: 'VerticalLayout', elements: null };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render VerticalLayout with children', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const uiSchema = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }, { type: 'Control' }]
    };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.children.length, 2);
});
ava_1.default('Hide VerticalLayout', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const verticalLayout = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }]
    };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    const runtime = verticalLayout.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('Disable VerticalLayout', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const verticalLayout = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }]
    };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    const runtime = verticalLayout.runtime;
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('Enable VerticalLayout', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const verticalLayout = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }]
    };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    const runtime = verticalLayout.runtime;
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('VerticalLayout should not be hidden if disconnected', t => {
    const renderer = new vertical_layout_1.VerticalLayoutRenderer();
    const verticalLayout = {
        type: 'VerticalLayout',
        elements: [{ type: 'Control' }]
    };
    renderer.setUiSchema(verticalLayout);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = verticalLayout.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'vertical-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=vertical.layout.test.js.map