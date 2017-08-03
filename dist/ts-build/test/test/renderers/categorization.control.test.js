"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
require("../helpers/setup");
/*tslint:disable:ordered-imports*/
const data_service_1 = require("../../src/core/data.service");
const categorization_renderer_1 = require("../../src/renderers/additional/categorization-renderer");
const core_1 = require("../../src/core");
const base_control_tests_1 = require("./base.control.tests");
ava_1.default.before(t => {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'categorization',
            classNames: ['jsf-categorization']
        },
        {
            name: 'categorization.master',
            classNames: ['jsf-categorization-master']
        },
        {
            name: 'category.group',
            classNames: ['jsf-category-group']
        },
        {
            name: 'category.subcategories',
            classNames: ['jsf-category-subcategories']
        },
        {
            name: 'categorization.detail',
            classNames: ['jsf-categorization-detail']
        }
    ]);
});
ava_1.default.beforeEach(t => {
    t.context.data = {};
    t.context.uiSchema = {
        type: 'Categorization',
        elements: [
            {
                type: 'Category',
                label: 'B'
            },
        ]
    };
});
ava_1.default('CategorizationTester', t => {
    t.is(categorization_renderer_1.categorizationTester(undefined, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester(null, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester({ type: 'Foo' }, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester({ type: 'Categorization' }, undefined), -1);
});
ava_1.default('apply tester with null elements and no schema', t => {
    const uiSchema = {
        type: 'Categorization',
        elements: null
    };
    t.is(categorization_renderer_1.categorizationTester(uiSchema, undefined), -1);
});
ava_1.default('apply tester with empty elements and no schema', t => {
    const uiSchema = {
        type: 'Categorization',
        elements: []
    };
    t.is(categorization_renderer_1.categorizationTester(uiSchema, undefined), -1);
});
ava_1.default('apply tester with single unknown element and no schema', t => {
    const uiSchema = {
        type: 'Categorization',
        elements: [
            {
                type: 'Foo'
            },
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(uiSchema, undefined), -1);
});
ava_1.default('apply tester with single category and no schema', t => {
    const categorization = {
        type: 'Categorization',
        elements: [
            {
                type: 'Category'
            }
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(categorization, undefined), 1);
});
ava_1.default('apply tester with nested categorization and single category and no schema', t => {
    const nestedCategorization = {
        type: 'Categorization',
        elements: [
            {
                type: 'Category'
            }
        ]
    };
    const categorization = {
        type: 'Categorization',
        elements: [nestedCategorization]
    };
    t.is(categorization_renderer_1.categorizationTester(categorization, undefined), 1);
});
ava_1.default('apply tester with nested categorizations, but no category and no schema', t => {
    const categorization = {
        type: 'Categorization',
        elements: [
            {
                type: 'Categorization'
            }
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(categorization, undefined), -1);
});
ava_1.default('apply tester with nested categorizations, null elements and no schema', t => {
    const categorization = {
        type: 'Categorization',
        elements: [
            {
                type: 'Categorization',
                elements: null
            }
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(categorization, undefined), -1);
});
ava_1.default('apply tester with nested categorizations, empty elements and no schema', t => {
    const categorization = {
        type: 'Categorization',
        elements: [
            {
                type: 'Categorization',
                elements: []
            }
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(categorization, undefined), -1);
});
ava_1.default('CategorizationRenderer static', t => {
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const renderer = new categorization_renderer_1.CategorizationRenderer();
    const data = { 'name': 'Foo' };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    const nameControl = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const innerCat = {
        type: 'Categorization',
        label: 'Bar',
        elements: [
            {
                type: 'Category',
                label: 'A',
                elements: [nameControl]
            }
        ]
    };
    const categorization = {
        type: 'Categorization',
        label: 'Root',
        elements: [
            innerCat,
            {
                type: 'Category',
                label: 'B',
                elements: [nameControl]
            }
        ]
    };
    renderer.setUiSchema(categorization);
    const result = renderer.render();
    t.is(result.className, 'jsf-categorization');
    t.is(result.childNodes.length, 2);
    // master tree
    const master = result.children[0]; // <-- TODO needed?
    t.is(master.className, 'jsf-categorization-master');
    t.is(master.children.length, 1);
    const ul = master.children[0];
    t.is(ul.children.length, 2);
    const liA = ul.children[0];
    t.is(liA.className, 'jsf-category-group');
    t.is(liA.children.length, 2);
    const spanA = liA.children[0];
    t.is(spanA.textContent, 'Bar');
    const innerUlA = liA.children[1];
    t.is(innerUlA.className, 'jsf-category-subcategories');
    t.is(innerUlA.children.length, 1);
    const innerLiA = innerUlA.children[0];
    t.is(innerLiA.children.length, 1);
    const innerSpanA = innerLiA.children[0];
    t.is(innerSpanA.textContent, 'A');
    const liB = ul.children[1];
    t.not(liB.className, 'jsf-category-group');
    t.is(liB.children.length, 1);
    const spanB = liB.children[0];
    t.is(spanB.textContent, 'B');
    // detail
    const detail = result.children[1];
    t.is(detail.className, 'jsf-categorization-detail');
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 1);
    t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
});
ava_1.default('CategorizationRenderer dynamic', t => {
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    const renderer = new categorization_renderer_1.CategorizationRenderer();
    const data = { 'name': 'Foo' };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    const nameControl = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
    const innerCategorization = {
        type: 'Categorization',
        label: 'Bar',
        elements: [
            {
                type: 'Category',
                label: 'A',
                elements: [nameControl]
            },
        ]
    };
    const categorization = {
        type: 'Categorization',
        label: 'Root',
        elements: [
            innerCategorization,
            {
                type: 'Category',
                label: 'B',
                elements: [nameControl, nameControl]
            },
            {
                type: 'Category',
                label: 'C',
                elements: undefined
            },
            {
                type: 'Category',
                label: 'D',
                elements: null
            },
        ]
    };
    renderer.setUiSchema(categorization);
    const result = renderer.render();
    t.is(result.className, 'jsf-categorization');
    t.is(result.childNodes.length, 2);
    // master tree
    const master = result.children[0]; // <-- TODO needed?
    t.is(master.children.length, 1);
    const ul = master.children[0];
    t.is(ul.children.length, 4);
    const liB = ul.children[1];
    const liC = ul.children[2];
    const liD = ul.children[3];
    // detail
    const detail = result.children[1];
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 1);
    t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
    liB.click();
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 2);
    t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
    t.is(detail.children.item(0).children.item(1).tagName, 'JSON-FORMS');
    liC.click();
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 0);
    liD.click();
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 0);
});
ava_1.default('CategorizationRenderer notify visible', t => {
    const renderer = new categorization_renderer_1.CategorizationRenderer();
    const categorization = {
        type: 'Categorization',
        label: '',
        elements: [
            {
                type: 'Category',
                label: 'B',
                elements: []
            }
        ]
    };
    renderer.setUiSchema(categorization);
    renderer.connectedCallback();
    const runtime = categorization.runtime;
    runtime.visible = false;
    t.is(renderer.hidden, true);
});
ava_1.default('CategorizationRenderer notify disabled', t => {
    const renderer = new categorization_renderer_1.CategorizationRenderer();
    const categorization = {
        type: 'Categorization',
        label: '',
        elements: [
            {
                type: 'Category',
                label: 'B',
                elements: []
            }
        ]
    };
    renderer.setUiSchema(categorization);
    renderer.connectedCallback();
    const runtime = categorization.runtime;
    runtime.enabled = false;
    t.is(renderer.getAttribute('disabled'), 'true');
});
ava_1.default('CategorizationRenderer notify enabled', t => {
    const renderer = new categorization_renderer_1.CategorizationRenderer();
    const categorization = {
        type: 'Categorization',
        label: '',
        elements: [
            {
                type: 'Category',
                label: 'B',
                elements: []
            }
        ]
    };
    renderer.setUiSchema(categorization);
    renderer.connectedCallback();
    const runtime = categorization.runtime;
    runtime.enabled = true;
    t.false(renderer.hasAttribute('disabled'));
});
ava_1.default('CategorizationRenderer disconnected no notify visible', t => {
    base_control_tests_1.testNotifyAboutVisibiltyWhenDisconnected(t, new categorization_renderer_1.CategorizationRenderer());
});
//# sourceMappingURL=categorization.control.test.js.map