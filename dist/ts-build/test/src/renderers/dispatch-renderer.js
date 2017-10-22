"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("./JSX");
const _ = require("lodash");
const unknown_renderer_1 = require("./unknown.renderer");
const inferno_redux_1 = require("inferno-redux");
exports.DispatchRenderer = (props) => {
    const { uischema, path, schema, renderers } = props;
    const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
    if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
        return JSX_1.JSX.createElement(unknown_renderer_1.UnknownRenderer, null);
    }
    else {
        const Render = renderer.renderer;
        return (JSX_1.JSX.createElement(Render, { uischema: uischema, schema: schema, path: path, renderers: renderers }));
    }
};
const mapStateToProps = state => ({
    renderers: state.renderers || []
});
exports.JsonFormsRenderer = inferno_redux_1.connect(mapStateToProps, null)(exports.DispatchRenderer);
exports.default = exports.JsonFormsRenderer;
//# sourceMappingURL=dispatch-renderer.js.map