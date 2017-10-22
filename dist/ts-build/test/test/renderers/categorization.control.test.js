"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const categorization_renderer_1 = require("../../src/renderers/additional/categorization-renderer");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const setup_1 = require("../helpers/setup");
const inferno_redux_1 = require("inferno-redux");
ava_1.default.before(() => {
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
    t.context.schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
    t.context.uischema = {
        type: 'Categorization',
        elements: [
            {
                type: 'Category',
                label: 'B'
            },
        ]
    };
});
ava_1.default('tester', t => {
    t.is(categorization_renderer_1.categorizationTester(undefined, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester(null, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester({ type: 'Foo' }, undefined), -1);
    t.is(categorization_renderer_1.categorizationTester({ type: 'Categorization' }, undefined), -1);
});
ava_1.default('tester with null elements and no schema', t => {
    const uischema = {
        type: 'Categorization',
        elements: null
    };
    t.is(categorization_renderer_1.categorizationTester(uischema, undefined), -1);
});
ava_1.default('tester with empty elements and no schema', t => {
    const uischema = {
        type: 'Categorization',
        elements: []
    };
    t.is(categorization_renderer_1.categorizationTester(uischema, undefined), -1);
});
ava_1.default('apply tester with single unknown element and no schema', t => {
    const uischema = {
        type: 'Categorization',
        elements: [
            {
                type: 'Foo'
            },
        ]
    };
    t.is(categorization_renderer_1.categorizationTester(uischema, undefined), -1);
});
ava_1.default('tester with single category and no schema', t => {
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
ava_1.default('tester with nested categorization and single category and no schema', t => {
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
ava_1.default('tester with nested categorizations, but no category and no schema', t => {
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
ava_1.default('tester with nested categorizations, null elements and no schema', t => {
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
ava_1.default('tester with nested categorizations, empty elements and no schema', t => {
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
ava_1.default('render', t => {
    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        }
    };
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
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(t.context.data, schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: schema, uischema: uischema })));
    // master tree
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    const master = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'jsf-categorization-master');
    const ul = master.children[0];
    const liA = ul.children[0];
    const spanA = liA.children[0];
    const innerUlA = liA.children[1];
    const innerLiA = innerUlA.children[0];
    const innerSpanA = innerLiA.children[0];
    const liB = ul.children[1];
    const spanB = liB.children[0];
    // detail
    const detail = fieldSet.children[1];
    t.is(fieldSet.className, 'jsf-categorization');
    t.is(fieldSet.childNodes.length, 2);
    t.is(master.className, 'jsf-categorization-master');
    t.is(master.children.length, 1);
    t.is(ul.children.length, 2);
    t.is(liA.className, 'jsf-category-group');
    t.is(liA.children.length, 2);
    t.is(spanA.textContent, 'Bar');
    t.is(innerUlA.className, 'jsf-category-subcategories');
    t.is(innerUlA.children.length, 1);
    t.is(innerLiA.children.length, 1);
    t.is(innerSpanA.textContent, 'A');
    t.not(liB.className, 'jsf-category-group');
    t.is(liB.children.length, 1);
    t.is(spanB.textContent, 'B');
    t.is(detail.className, 'jsf-categorization-detail');
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 1);
});
ava_1.default('render on click', t => {
    const data = { 'name': 'Foo' };
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
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    const master = fieldSet.children[0];
    const ul = master.children[0];
    const liB = ul.children[1];
    const liC = ul.children[2];
    const liD = ul.children[3];
    // detail
    const detail = fieldSet.children[1];
    const evt = new Event('click', {
        'bubbles': true,
        'cancelable': true
    });
    t.is(fieldSet.className, 'jsf-categorization');
    t.is(fieldSet.childNodes.length, 2);
    t.is(master.children.length, 1);
    t.is(ul.children.length, 4);
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 1);
    liB.dispatchEvent(evt);
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 2);
    liC.dispatchEvent(evt);
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 0);
    liD.dispatchEvent(evt);
    t.is(detail.children.length, 1);
    t.is(detail.children.item(0).tagName, 'DIV');
    t.is(detail.children.item(0).children.length, 0);
});
ava_1.default('hide', t => {
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: t.context.schema, uischema: uischema, visible: false })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    t.true(fieldSet.hidden);
});
ava_1.default('showed by default', t => {
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    t.false(fieldSet.hidden);
});
ava_1.default('disabled', t => {
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: t.context.schema, uischema: uischema, enabled: false })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    t.true(fieldSet.disabled);
});
ava_1.default('enabled by default', t => {
    const uischema = {
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
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(categorization_renderer_1.default, { schema: t.context.schema, uischema: uischema })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'fieldset');
    t.false(fieldSet.disabled);
});
//# sourceMappingURL=categorization.control.test.js.map