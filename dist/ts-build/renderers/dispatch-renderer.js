"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("./JSX");
var _ = require("lodash");
var unknown_renderer_1 = require("./unknown.renderer");
var binding_1 = require("../common/binding");
exports.DispatchRenderer = function (_a) {
    var uischema = _a.uischema, schema = _a.schema, path = _a.path, renderers = _a.renderers;
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
exports.default = binding_1.connect(mapStateToProps, null)(exports.DispatchRenderer);
//# sourceMappingURL=dispatch-renderer.js.map