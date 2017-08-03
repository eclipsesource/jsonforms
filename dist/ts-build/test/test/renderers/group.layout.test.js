"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
// setup import must come first
require("../helpers/setup");
/*tslint:enable */
const group_layout_1 = require("../../src/renderers/layouts/group.layout");
const core_1 = require("../../src/core");
ava_1.default.before(t => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'group-layout',
            classNames: ['group-layout']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.uiSchema = {
        type: 'GroupLayout',
        elements: [{ type: 'Control' }]
    };
});
ava_1.default('GroupLayout tester', t => {
    t.is(group_layout_1.groupTester(undefined, undefined), -1);
    t.is(group_layout_1.groupTester(null, undefined), -1);
    t.is(group_layout_1.groupTester({ type: 'Foo' }, undefined), -1);
    t.is(group_layout_1.groupTester({ type: 'Group' }, undefined), 1);
});
ava_1.default('Render GroupLayout with undefined elements', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    const uiSchema = {
        type: 'GroupLayout'
    };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render GroupLayout with label', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    const uiSchema = {
        type: 'Group',
        label: 'Foo',
        elements: [],
    };
    renderer.setUiSchema(uiSchema);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 1);
    const legend = div.children[0];
    t.is(legend.tagName, 'LEGEND');
    // TODO: fix warning
    /*tslint:disable */
    t.is(legend['innerText'], 'Foo');
    /*tslint:enable */
});
ava_1.default('Render GroupLayout with null elements', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    const groupLayout = {
        type: 'Group',
        elements: null
    };
    renderer.setUiSchema(groupLayout);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 0);
});
ava_1.default('Render GroupLayout with children', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    const groupLayout = {
        type: 'Group',
        elements: [
            { type: 'Control' },
            { type: 'Control' }
        ]
    };
    renderer.setUiSchema(groupLayout);
    const result = renderer.render();
    t.is(result.childNodes.length, 1);
    const div = result.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.children.length, 2);
});
ava_1.default('Hide GroupLayout', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(renderer.hidden, true);
});
ava_1.default('Disable GroupLayout', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(div.getAttribute('disabled'), 'true');
});
ava_1.default('Enable GroupLayout', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.enabled = true;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.false(div.hasAttribute('disabled'));
});
ava_1.default('GroupLayout should not be hidden if disconnected', t => {
    const renderer = new group_layout_1.GroupLayoutRenderer();
    renderer.setUiSchema(t.context.uiSchema);
    renderer.connectedCallback();
    renderer.disconnectedCallback();
    const runtime = t.context.uiSchema.runtime;
    runtime.visible = false;
    t.is(renderer.childNodes.length, 1);
    const div = renderer.children[0];
    t.is(div.tagName, 'FIELDSET');
    t.is(div.className, 'group-layout');
    t.is(renderer.hidden, false);
});
//# sourceMappingURL=group.layout.test.js.map