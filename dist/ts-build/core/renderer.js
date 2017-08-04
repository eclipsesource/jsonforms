"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("./runtime");
/**
 * A renderer is a regular HTMLElement that has a render method which will
 * manipulate the underlying document when called. It also provides several
 * lifecycle hooks.
 */
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Set the UI schema.
     * @param {UISchemaElement} uischema the UI schema element to be set
     */
    Renderer.prototype.setUiSchema = function (uischema) {
        this.uischema = uischema;
    };
    /**
     * Set the data service.
     * @param {DataService} dataService the data service to be set
     */
    Renderer.prototype.setDataService = function (dataService) {
        this.dataService = dataService;
    };
    /**
     * Set the JSON data schema .
     * @param {JsonSchema} dataSchema the data schema
     */
    Renderer.prototype.setDataSchema = function (dataSchema) {
        this.dataSchema = dataSchema;
    };
    /**
     * Notify this renderer about any run-time changes.
     *
     * @param {RUNTIME_TYPE} type the type of runtime change
     */
    Renderer.prototype.runtimeUpdated = function (type) {
        // no-op
    };
    /**
     * Called when this renderer is inserted into a document.
     */
    Renderer.prototype.connectedCallback = function () {
        if (!this.uischema.hasOwnProperty('runtime')) {
            this.uischema.runtime = new runtime_1.Runtime();
        }
        var runtime = this.uischema.runtime;
        runtime.registerRuntimeListener(this);
        this.render();
    };
    /**
     * Called when this renderer is removed from a document.
     */
    Renderer.prototype.disconnectedCallback = function () {
        this.dispose();
        var runtime = this.uischema.runtime;
        runtime.deregisterRuntimeListener(this);
    };
    Renderer.prototype.convertToClassName = function (value) {
        var result = value.replace('#', 'root');
        result = result.replace(new RegExp('/', 'g'), '_');
        return result;
    };
    return Renderer;
}(HTMLElement));
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map