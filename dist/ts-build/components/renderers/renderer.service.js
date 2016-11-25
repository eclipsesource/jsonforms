"use strict";
var testers_1 = require('./testers');
exports.NOT_FITTING = -1;
var RendererServiceImpl = (function () {
    function RendererServiceImpl() {
        this.renderer = [];
        this.register('norenderer', testers_1.always, 0);
    }
    RendererServiceImpl.prototype.register = function (directiveName, tester, spec) {
        if (spec === void 0) { spec = 100; }
        this.renderer.push({ directiveName: directiveName, tester: testers_1.Testers.create(tester, spec) });
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
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
//# sourceMappingURL=renderer.service.js.map