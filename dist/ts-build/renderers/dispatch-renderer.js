"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("./JSX");
var _ = require("lodash");
var unknown_renderer_1 = require("./unknown.renderer");
var inferno_redux_1 = require("inferno-redux");
exports.DispatchRenderer = function (props) {
    var uischema = props.uischema, path = props.path, schema = props.schema, renderers = props.renderers;
    var renderer = _.maxBy(renderers, function (r) { return r.tester(uischema, schema); });
    if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
        return JSX_1.JSX.createElement(unknown_renderer_1.UnknownRenderer, null);
    }
    else {
        var Render = renderer.renderer;
        return (JSX_1.JSX.createElement(Render, { uischema: uischema, schema: schema, path: path, renderers: renderers }));
    }
};
var mapStateToProps = function (state) { return ({
    renderers: state.renderers || []
}); };
exports.JsonFormsRenderer = inferno_redux_1.connect(mapStateToProps, null)(exports.DispatchRenderer);
exports.default = exports.JsonFormsRenderer;
//# sourceMappingURL=dispatch-renderer.js.map