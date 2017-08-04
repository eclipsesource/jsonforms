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
var JsonRefs = require("json-refs");
var _ = require("lodash");
var core_1 = require("./core");
var schema_gen_1 = require("./generators/schema-gen");
var data_service_1 = require("./core/data.service");
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
var JsonFormsElement = (function (_super) {
    __extends(JsonFormsElement, _super);
    /**
     * Constructor.
     */
    function JsonFormsElement() {
        var _this = _super.call(this) || this;
        _this.schemaPromise = null;
        _this.allowDynamicUpdate = false;
        _this.services = [];
        /**
         * Called when this element is removed from a document.
         */
        _this.disconnectedCallback = function () {
            _this.services.forEach(function (service) {
                service.dispose();
            });
        };
        /**
         * Add a data change listener.
         *
         * @param {DataChangeListener} listener the listener to be added
         */
        _this.addDataChangeListener = function (listener) {
            _this.dataService.registerDataChangeListener(listener);
        };
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
            this.dataService = new data_service_1.DataService(data);
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
        if (this.dataObject == null || this.dataService == null) {
            return;
        }
        if (this.lastChild !== null) {
            this.removeChild(this.lastChild);
        }
        this.services.forEach(function (service) {
            service.dispose();
        });
        this.services = [];
        var schema = this.dataSchema;
        this.instantiateSchemaIfNeeded(schema);
        var uiSchema = this.uiSchema;
        this.createServices(uiSchema, schema);
        var bestRenderer = core_1.JsonForms.rendererService
            .findMostApplicableRenderer(uiSchema, schema, this.dataService);
        this.appendChild(bestRenderer);
        core_1.JsonForms.stylingRegistry.addStyle(this, 'json-forms');
        this.dataService.initDataChangeListeners();
    };
    JsonFormsElement.prototype.createServices = function (uiSchema, dataSchema) {
        var _this = this;
        core_1.JsonForms.jsonFormsServices.forEach(function (service) {
            return _this.services.push(new service(_this.dataService, dataSchema, uiSchema));
        });
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