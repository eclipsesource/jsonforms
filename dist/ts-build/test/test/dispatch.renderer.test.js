"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../src/renderers/JSX");
const ava_1 = require("ava");
const _ = require("lodash");
const setup_1 = require("./helpers/setup");
const renderer_1 = require("../src/core/renderer");
const inferno_test_utils_1 = require("inferno-test-utils");
const dispatch_renderer_1 = require("../src/renderers/dispatch-renderer");
const inferno_redux_1 = require("inferno-redux");
require("../src/renderers");
const actions_1 = require("../src/actions");
class CustomRenderer1 extends renderer_1.Renderer {
    render() {
        return (JSX_1.JSX.createElement("h1", null, "test"));
    }
}
class CustomRenderer2 extends renderer_1.Renderer {
    render() {
        return (JSX_1.JSX.createElement("h2", null, "test"));
    }
}
class CustomRenderer3 extends renderer_1.Renderer {
    render() {
        return (JSX_1.JSX.createElement("h3", null, "test"));
    }
}
ava_1.test.beforeEach(t => {
    t.context.data = { foo: 'John Doe' };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            }
        }
    };
});
ava_1.test('DispatchRenderer should report about missing renderer', t => {
    const data = { foo: 'John Doe' };
    const uischema = { type: 'Foo' };
    const schema = { type: 'object', properties: { foo: { type: 'string' } } };
    const store = setup_1.initJsonFormsStore(data, schema, uischema);
    const div = _.head(inferno_test_utils_1.scryRenderedDOMElementsWithTag(inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: uischema, schema: schema }))), 'div'));
    t.is(div.textContent, 'No applicable renderer found.');
});
ava_1.test('DispatchRenderer should pick most applicable renderer', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    store.dispatch(actions_1.registerRenderer(() => 10, CustomRenderer1));
    store.dispatch(actions_1.registerRenderer(() => 5, CustomRenderer1));
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: t.context.uischema, schema: t.context.schema })));
    t.not(inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'h1'), undefined);
});
ava_1.test('Dispatch renderer should not consider any de-registered renderers', t => {
    const tester1 = () => 9;
    const tester2 = () => 8;
    const tester3 = () => 10;
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    store.dispatch(actions_1.registerRenderer(tester1, CustomRenderer1));
    store.dispatch(actions_1.registerRenderer(tester2, CustomRenderer2));
    store.dispatch(actions_1.registerRenderer(tester3, CustomRenderer3));
    store.dispatch(actions_1.unregisterRenderer(tester3, CustomRenderer2));
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: t.context.uischema, schema: t.context.schema })));
    t.not(inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'h1'), undefined);
});
ava_1.test('deregister an unregistered renderer should be a no-op', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    store.dispatch(actions_1.registerRenderer(() => 10, CustomRenderer1));
    store.dispatch(actions_1.registerRenderer(() => 5, CustomRenderer2));
    const tester = () => 10;
    const nrOfRenderers = store.getState().renderers.length;
    store.dispatch(actions_1.unregisterRenderer(tester, CustomRenderer3));
    t.is(store.getState().renderers.length, nrOfRenderers);
});
//# sourceMappingURL=dispatch.renderer.test.js.map