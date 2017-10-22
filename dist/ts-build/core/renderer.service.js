"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../renderers/JSX");
var inferno_1 = require("inferno");
var _ = require("lodash");
var dispatch_renderer_1 = require("../renderers/dispatch-renderer");
/**
 * The renderer service maintains a list of renderers and
 * is responsible for finding the most applicable one given a UI schema, a schema
 * and a data service.infer
 */
var RendererService = /** @class */ (function () {
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
        return renderer;
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
    RendererService.prototype.findMostApplicableRenderer = function (uischema, schema, store) {
        console.log(inferno_1.default);
        // TODO: I think we don't need the store here
        return JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: uischema, store: store, schema: schema });
    };
    return RendererService;
}());
exports.RendererService = RendererService;
//# sourceMappingURL=renderer.service.js.map