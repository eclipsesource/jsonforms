var abstract_control_1 = require("./controls/abstract-control");
exports.NOT_FITTING = -1;
var RendererServiceImpl = (function () {
    function RendererServiceImpl(pathResolver) {
        this.pathResolver = pathResolver;
        this.renderer = [];
        this.renderer.push({ directiveName: 'norenderer', tester: abstract_control_1.Testers.none });
    }
    RendererServiceImpl.prototype.register = function (directiveName, tester, spec) {
        if (spec === void 0) { spec = 100; }
        this.renderer.push({ directiveName: directiveName, tester: abstract_control_1.Testers.create(tester, spec) });
    };
    RendererServiceImpl.prototype.getBestComponent = function (element, dataSchema, dataObject) {
        var bestRenderer = _.maxBy(this.renderer, function (renderer) {
            return renderer.tester(element, dataSchema, dataObject);
        });
        var bestDirective = bestRenderer.directiveName;
        return "<" + bestDirective + "></" + bestDirective + ">";
    };
    RendererServiceImpl.$inject = ['PathResolver'];
    return RendererServiceImpl;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
//# sourceMappingURL=renderer-service.js.map