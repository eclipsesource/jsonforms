"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var RendererService = (function () {
    function RendererService() {
        this.renderers = [];
    }
    RendererService.prototype.registerRenderer = function (tester, renderer) {
        this.renderers.push({ tester: tester, renderer: renderer });
    };
    RendererService.prototype.unregisterRenderer = function (tester, renderer) {
        this.renderers = _.filter(this.renderers, function (r) {
            // compare testers via strict equality
            return r.tester !== tester || !_.eq(r.renderer, renderer);
        });
    };
    RendererService.prototype.getBestRenderer = function (uischema, schema, dataService) {
        var bestRenderer = _.maxBy(this.renderers, function (renderer) {
            return renderer.tester(uischema, schema);
        });
        if (bestRenderer === undefined) {
            var renderer = document.createElement('label');
            renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uischema);
            return renderer;
        }
        else {
            var renderer = document.createElement(bestRenderer.renderer);
            renderer.setUiSchema(uischema);
            renderer.setDataSchema(schema);
            renderer.setDataService(dataService);
            return renderer;
        }
    };
    return RendererService;
}());
exports.RendererService = RendererService;
//# sourceMappingURL=renderer.service.js.map