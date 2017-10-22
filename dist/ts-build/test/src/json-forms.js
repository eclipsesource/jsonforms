"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("./renderers/JSX");
const inferno_1 = require("inferno");
const JsonRefs = require("json-refs");
const _ = require("lodash");
require("./renderers");
const core_1 = require("./core");
const schema_gen_1 = require("./generators/schema-gen");
const inferno_redux_1 = require("inferno-redux");
const store_1 = require("./store");
const dispatch_renderer_1 = require("./renderers/dispatch-renderer");
/**
 * Annotation that registered the given config and class as a custom element
 * @param {CustomElementConfig} config the configuration object for the custom element
 * @constructor
 */
// Usage as decorator
// tslint:disable:variable-name
const CustomElement = (config) => cls => {
    // tslint:enable:variable-name
    if (customElements.get(config.selector)) {
        return;
    }
    customElements.define(config.selector, cls);
};
/**
 * HTML element that represents the entry point
 */
let JsonFormsElement = class JsonFormsElement extends HTMLElement {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.schemaPromise = null;
        this.allowDynamicUpdate = false;
    }
    /**
     * Called when this element is inserted into a document.
     */
    connectedCallback() {
        this.allowDynamicUpdate = true;
        this.render();
    }
    /**
     * Set the data to be rendered.
     * @param {Object} data the data to be rendered
     */
    set data(data) {
        this.dataObject = data;
        // TODO
        this.render();
    }
    /**
     * Set the UI schema.
     * @param {UISchemaElement} uischema the UI schema element to be set
     */
    set uiSchema(uischema) {
        this.uischema = uischema;
        // TODO
        this.render();
    }
    /**
     * Returns the UI schema to be rendered.
     *
     * @returns {UISchemaElement} the UI schema to be rendered
     */
    get uiSchema() {
        if (!_.isEmpty(this.uischema)) {
            return this.uischema;
        }
        return core_1.JsonForms.uischemaRegistry.findMostApplicableUISchema(this.dataSchema, this.dataObject);
    }
    /**
     * Set the JSON data schema that describes the data to be rendered.
     * @param {JsonSchema} dataSchema the data schema to be rendered
     */
    set dataSchema(dataSchema) {
        this.schemaPromise = JsonRefs.resolveRefs(dataSchema, { includeInvalid: true });
        this.schemaPromise.then(result => {
            this.dataschema = result.resolved;
            this.schemaPromise = null;
            this.render();
        });
    }
    /**
     * Returns the JSON schema that describes the data to be rendered.
     *
     * @returns {JsonSchema} the JSON schema that describes the data to be rendered
     */
    get dataSchema() {
        if (!_.isEmpty(this.dataschema)) {
            return this.dataschema;
        }
        return schema_gen_1.generateJsonSchema(this.dataObject);
    }
    render() {
        if (!this.allowDynamicUpdate) {
            return;
        }
        if (this.schemaPromise !== null) {
            return;
        }
        if (_.isEmpty(this.dataObject)) {
            return;
        }
        const schema = this.dataSchema;
        this.instantiateSchemaIfNeeded(schema);
        const uischema = this.uiSchema;
        this.store = store_1.initJsonFormsStore(this.dataObject, schema, uischema);
        inferno_1.default.render(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: this.store },
            JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: uischema, schema: schema })), this);
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('json-forms');
    }
    instantiateSchemaIfNeeded(schema) {
        let parent = this.parentNode;
        while (parent !== document.body && parent !== null) {
            if (parent.nodeName === 'JSON-FORMS') {
                return;
            }
            parent = parent.parentNode;
        }
        core_1.JsonForms.schema = schema;
    }
};
JsonFormsElement = __decorate([
    CustomElement({
        selector: 'json-forms'
    }),
    __metadata("design:paramtypes", [])
], JsonFormsElement);
exports.JsonFormsElement = JsonFormsElement;
//# sourceMappingURL=json-forms.js.map