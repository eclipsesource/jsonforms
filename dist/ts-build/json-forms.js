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
var core_1 = require("./core");
var schema_gen_1 = require("./generators/schema-gen");
var JsonRefs = require("json-refs");
var data_service_1 = require("./core/data.service");
var CustomElement = function (config) { return function (cls) {
    return customElements.define(config.selector, cls);
}; };
var JsonForms = (function (_super) {
    __extends(JsonForms, _super);
    function JsonForms() {
        var _this = _super.call(this) || this;
        _this.schemaPromise = null;
        _this.allowDynamicUpdate = false;
        _this.services = [];
        return _this;
    }
    JsonForms.prototype.connectedCallback = function () {
        this.allowDynamicUpdate = true;
        this.render();
    };
    JsonForms.prototype.disconnectedCallback = function () {
        this.services.forEach(function (service) { return service.dispose(); });
    };
    JsonForms.prototype.render = function () {
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
        this.services.forEach(function (service) { return service.dispose(); });
        this.services = [];
        var schema = this.dataSchema;
        var uiSchema = this.uiSchema;
        this.createServices(uiSchema, schema);
        var bestRenderer = core_1.JsonFormsHolder.rendererService
            .getBestRenderer(uiSchema, schema, this.dataService);
        this.appendChild(bestRenderer);
        this.dataService.initialRootRun();
    };
    Object.defineProperty(JsonForms.prototype, "data", {
        set: function (data) {
            this.dataObject = data;
            this.dataService = new data_service_1.DataService(data);
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonForms.prototype, "uiSchema", {
        get: function () {
            if (this.uischema) {
                return this.uischema;
            }
            return core_1.JsonFormsHolder.uischemaRegistry.getBestUiSchema(this.dataSchema, this.dataObject);
        },
        set: function (uischema) {
            this.uischema = uischema;
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonForms.prototype, "dataSchema", {
        get: function () {
            if (this.dataschema) {
                return this.dataschema;
            }
            return schema_gen_1.generateJsonSchema(this.dataObject);
        },
        set: function (dataschema) {
            var _this = this;
            this.schemaPromise = JsonRefs.resolveRefs(dataschema);
            this.schemaPromise.then(function (result) {
                _this.dataschema = result.resolved;
                _this.schemaPromise = null;
                _this.render();
            });
        },
        enumerable: true,
        configurable: true
    });
    JsonForms.prototype.createServices = function (uiSchema, dataSchema) {
        var _this = this;
        core_1.JsonFormsHolder.jsonFormsServices.forEach(function (service) {
            return _this.services.push(new service(_this.dataService, dataSchema, uiSchema));
        });
    };
    JsonForms.prototype.addDataChangeListener = function (listener) {
        this.dataService.registerChangeListener(listener);
    };
    return JsonForms;
}(HTMLElement));
JsonForms = __decorate([
    CustomElement({
        selector: 'json-forms'
    }),
    __metadata("design:paramtypes", [])
], JsonForms);
exports.JsonForms = JsonForms;
//# sourceMappingURL=json-forms.js.map