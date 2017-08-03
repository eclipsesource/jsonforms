"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
// setup import must come first
require("../helpers/setup");
/*tslint:enable */
const core_1 = require("../../src/core");
const horizontal_layout_1 = require("../../src/renderers/layouts/horizontal.layout");
ava_1.default.before(t => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'horizontal-layout',
            classNames: ['horizontal-layout']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.uiSchema = {
        type: 'HorizontalLayout',
        elements: [{ type: 'Control' }]
    };
});
ava_1.default('HorizontalLayout tester', t => {
    t.is(horizontal_layout_1.horizontalLayoutTester(undefined, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester(null, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester({ type: 'Foo' }, undefined), -1);
    t.is(horizontal_layout_1.horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined), 1);
});
ava_1.default('Render HorizontalLayout with undefined elements', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    const uiSchema = {
        type: 'HorizontalLayout'
    };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render HorizontalLayout with null elements', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    const horizontalLayout = {
        type: 'HorizontalLayout',
        elements: null
    };
    renderer.setUiSchema(horizontalLayout);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render HorizontalLayout with children', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    const horizontalLayout = {
        type: 'HorizontalLayout',
        elements: [
            { type: 'Control' },
            { type: 'Control' }
        ]
    };
    renderer.setUiSchema(horizontalLayout);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.children.length, 2);
});
ava_1.default('Hide HorizontalLayout', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('Disable HorizontalLayout', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('Enable HorizontalLayout', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('HorizontalLayout should not be hidden if disconnected', t => {
    const renderer = new horizontal_layout_1.HorizontalLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'DIV');
    t.is(div.className, 'horizontal-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=horizontal.layout.test.js.map