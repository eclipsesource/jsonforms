"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/**
 * The renderer service maintains a list of renderers and
 * is responsible for finding the most applicable one given a UI schema, a schema
 * and a data service.
 */
var RendererService = (function () {
    function RendererService() {
        this.renderers = [];
    }
    /**
     * Register a renderer. A renderer is represented by the tag name of the corresponding
     * HTML element, which is assumed to have been registered as a custom element.
     *
     * @param {RankedTester} tester a tester that determines whether when the renderer should be used
     * @param {string} renderer the tag name of the HTML element that represents the renderer
     */
    RendererService.prototype.registerRenderer = function (tester, renderer) {
        this.renderers.push({ tester: tester, renderer: renderer });
    };
    /**
     * Deregister a renderer.
     *
     * @param {RankedTester} tester the tester of the renderer to be un-registered.
     *        Note that strict equality is used when un-registering renderers.
     * @param {string} renderer the tag name of the HTML element that represents
     *        the renderer to be un-registered
     */
    RendererService.prototype.deregisterRenderer = function (tester, renderer) {
        this.renderers = _.filter(this.renderers, function (r) {
            // compare testers via strict equality
            return r.tester !== tester || !_.eq(r.renderer, renderer);
        });
    };
    /**
     * Find the renderer that is capable of rendering the given UI schema.
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     * @param {JsonSchema} schema the JSON data schema the associated data schema
     * @param {DataService} dataService the data service holding the data to be rendered
     * @return {HTMLElement} the rendered HTML element
     */
    RendererService.prototype.findMostApplicableRenderer = function (uiSchema, schema, dataService) {
        var bestRenderer = _.maxBy(this.renderers, function (renderer) {
            return renderer.tester(uiSchema, schema);
        });
        if (bestRenderer === undefined) {
            var renderer = document.createElement('label');
            renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uiSchema);
            return renderer;
        }
        else {
            var renderer = document.createElement(bestRenderer.renderer);
            renderer.setUiSchema(uiSchema);
            renderer.setDataSchema(schema);
            renderer.setDataService(dataService);
            return renderer;
        }
    };
    return RendererService;
}());
exports.RendererService = RendererService;
//# sourceMappingURL=renderer.service.js.map