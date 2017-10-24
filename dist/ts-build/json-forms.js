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
var JSX_1 = require("./renderers/JSX");
var inferno_1 = require("inferno");
var JsonRefs = require("json-refs");
var _ = require("lodash");
require("./renderers");
var core_1 = require("./core");
var schema_gen_1 = require("./generators/schema-gen");
var inferno_redux_1 = require("inferno-redux");
var store_1 = require("./store");
var dispatch_renderer_1 = require("./renderers/dispatch-renderer");
/**
 * Annotation that registered the given config and class as a custom element
 * @param {CustomElementConfig} config the configuration object for the custom element
 * @constructor
 */
// Usage as decorator
// tslint:disable:variable-name
var CustomElement = function (config) { return function (cls) {
    // tslint:enable:variable-name
    if (customElements.get(config.selector)) {
        return;
    }
    customElements.define(config.selector, cls);
}; };
/**
 * HTML element that represents the entry point
 */
var JsonFormsElement = /** @class */ (function (_super) {
    __extends(JsonFormsElement, _super);
    /**
     * Constructor.
     */
    function JsonFormsElement() {
        var _this = _super.call(this) || this;
        _this.schemaPromise = null;
        _this.allowDynamicUpdate = false;
        return _this;
    }
    /**
     * Called when this element is inserted into a document.
     */
    JsonFormsElement.prototype.connectedCallback = function () {
        this.allowDynamicUpdate = true;
        this.render();
    };
    Object.defineProperty(JsonFormsElement.prototype, "data", {
        /**
         * Set the data to be rendered.
         * @param {Object} data the data to be rendered
         */
        set: function (data) {
            this.dataObject = data;
            // TODO
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonFormsElement.prototype, "uiSchema", {
        /**
         * Returns the UI schema to be rendered.
         *
         * @returns {UISchemaElement} the UI schema to be rendered
         */
        get: function () {
            if (!_.isEmpty(this.uischema)) {
                return this.uischema;
            }
            return core_1.JsonForms.uischemaRegistry.findMostApplicableUISchema(this.dataSchema, this.dataObject);
        },
        /**
         * Set the UI schema.
         * @param {UISchemaElement} uischema the UI schema element to be set
         */
        set: function (uischema) {
            this.uischema = uischema;
            // TODO
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonFormsElement.prototype, "dataSchema", {
        /**
         * Returns the JSON schema that describes the data to be rendered.
         *
         * @returns {JsonSchema} the JSON schema that describes the data to be rendered
         */
        get: function () {
            if (!_.isEmpty(this.dataschema)) {
                return this.dataschema;
            }
            return schema_gen_1.generateJsonSchema(this.dataObject);
        },
        /**
         * Set the JSON data schema that describes the data to be rendered.
         * @param {JsonSchema} dataSchema the data schema to be rendered
         */
        set: function (dataSchema) {
            var _this = this;
            this.schemaPromise = JsonRefs.resolveRefs(dataSchema, { includeInvalid: true });
            this.schemaPromise.then(function (result) {
                _this.dataschema = result.resolved;
                _this.schemaPromise = null;
                _this.render();
            });
        },
        enumerable: true,
        configurable: true
    });
    JsonFormsElement.prototype.render = function () {
        if (!this.allowDynamicUpdate) {
            return;
        }
        if (this.schemaPromise !== null) {
            return;
        }
        if (_.isEmpty(this.dataObject)) {
            return;
        }
        var schema = this.dataSchema;
        this.instantiateSchemaIfNeeded(schema);
        var uischema = this.uiSchema;
        this.store = store_1.initJsonFormsStore(this.dataObject, schema, uischema);
        inferno_1.default.render(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: this.store },
            JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: uischema, schema: schema })), this);
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('json-forms');
    };
    JsonFormsElement.prototype.instantiateSchemaIfNeeded = function (schema) {
        var parent = this.parentNode;
        while (parent !== document.body && parent !== null) {
            if (parent.nodeName === 'JSON-FORMS') {
                return;
            }
            parent = parent.parentNode;
        }
        core_1.JsonForms.schema = schema;
    };
    JsonFormsElement = __decorate([
        CustomElement({
            selector: 'json-forms'
        }),
        __metadata("design:paramtypes", [])
    ], JsonFormsElement);
    return JsonFormsElement;
}(HTMLElement));
exports.JsonFormsElement = JsonFormsElement;
//# sourceMappingURL=json-forms.js.map