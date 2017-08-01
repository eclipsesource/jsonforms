"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
/**
 * A renderer is a regular HTMLElement that has a render method which will
 * manipulate the underlying document when called. It also provides several
 * lifecycle hooks.
 */
class Renderer extends HTMLElement {
    /**
     * Set the UI schema.
     * @param {UISchemaElement} uischema the UI schema element to be set
     */
    setUiSchema(uischema) {
        this.uischema = uischema;
    }
    /**
     * Set the data service.
     * @param {DataService} dataService the data service to be set
     */
    setDataService(dataService) {
        this.dataService = dataService;
    }
    /**
     * Set the JSON data schema .
     * @param {JsonSchema} dataSchema the data schema
     */
    setDataSchema(dataSchema) {
        this.dataSchema = dataSchema;
    }
    /**
     * Notify this renderer about any run-time changes.
     *
     * @param {RUNTIME_TYPE} type the type of runtime change
     */
    runtimeUpdated(type) {
        // no-op
    }
    /**
     * Called when this renderer is inserted into a document.
     */
    connectedCallback() {
        if (!this.uischema.hasOwnProperty('runtime')) {
            this.uischema.runtime = new runtime_1.Runtime();
        }
        const runtime = this.uischema.runtime;
        runtime.registerRuntimeListener(this);
        this.render();
    }
    /**
     * Called when this renderer is removed from a document.
     */
    disconnectedCallback() {
        this.dispose();
        const runtime = this.uischema.runtime;
        runtime.deregisterRuntimeListener(this);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map