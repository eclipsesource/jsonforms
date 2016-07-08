exports.NOT_FITTING = -1;
var NoRendererTester = function (element, dataSchema, dataObject, pathResolver) {
    return 0;
};
var RendererServiceImpl = (function () {
    function RendererServiceImpl(pathResolver) {
        this.pathResolver = pathResolver;
        this.renderer = [];
        this.renderer.push({ directiveName: 'norenderer', tester: NoRendererTester });
    }
    RendererServiceImpl.prototype.register = function (directiveName, tester) {
        this.renderer.push({ directiveName: directiveName, tester: tester });
    };
    RendererServiceImpl.prototype.getBestComponent = function (element, dataSchema, dataObject) {
        var _this = this;
        var bestRenderer = _.maxBy(this.renderer, function (renderer) {
            return renderer.tester(element, dataSchema, dataObject, _this.pathResolver);
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