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
var core_1 = require("../core");
var data_service_1 = require("../core/data.service");
var runtime_1 = require("../core/runtime");
var path_util_1 = require("../path.util");
var AJV = require("ajv");
var ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
/**
 * Validator service based on ajv.
 */
var JsonFormsValidator = (function () {
    /**
     * Constructor.
     *
     * @param {DataService} dataService the data service
     * @param {JsonSchema} dataSchema the JSON schema describing the data
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     */
    function JsonFormsValidator(dataService, dataSchema, uiSchema) {
        var _this = this;
        this.dataService = dataService;
        this.pathToControlMap = {};
        /**
         * @inheritDoc
         */
        this.dataChanged = function (uischema, newValue, data) {
            _this.validate(data);
        };
        /**
         * @inheritDoc
         */
        this.dispose = function () {
            _this.dataService.deregisterDataChangeListener(_this);
        };
        dataService.registerDataChangeListener(this);
        this.validator = ajv.compile(dataSchema);
        this.parseUiSchema(uiSchema);
    }
    /**
     * @inheritDoc
     */
    JsonFormsValidator.prototype.needsNotificationAbout = function (_) {
        return true;
    };
    JsonFormsValidator.prototype.parseUiSchema = function (uiSchema) {
        var _this = this;
        if (uiSchema.hasOwnProperty('elements')) {
            uiSchema.elements.forEach(function (element) {
                _this.parseUiSchema(element);
            });
        }
        else if (uiSchema.hasOwnProperty('scope')) {
            var control = uiSchema;
            var instancePath = path_util_1.toDataPath(control.scope.$ref);
            this.pathToControlMap[instancePath] = control;
        }
    };
    JsonFormsValidator.prototype.validate = function (data) {
        var _this = this;
        this.cleanAllValidationErrors();
        var valid = this.validator(data);
        if (valid) {
            return;
        }
        var errors = this.validator.errors;
        errors.forEach(function (error) {
            _this.mapErrorToControl(error);
        });
    };
    JsonFormsValidator.prototype.mapErrorToControl = function (error) {
        var uiSchema = this.pathToControlMap[error.dataPath.substring(1)];
        if (uiSchema === undefined) {
            // FIXME should we log this at all?
            console.warn('No control for showing validation error @', error.dataPath.substring(1));
            return;
        }
        if (!uiSchema.hasOwnProperty('runtime')) {
            uiSchema.runtime = new runtime_1.Runtime();
        }
        var runtime = uiSchema.runtime;
        runtime.validationErrors = [];
        runtime.validationErrors = runtime.validationErrors.concat(error.message);
    };
    JsonFormsValidator.prototype.cleanAllValidationErrors = function () {
        var _this = this;
        Object.keys(this.pathToControlMap).forEach(function (key) {
            if (!_this.pathToControlMap[key].hasOwnProperty('runtime')) {
                return;
            }
            (_this.pathToControlMap[key].runtime).validationErrors = undefined;
        });
    };
    JsonFormsValidator = __decorate([
        core_1.JsonFormsServiceElement({}),
        __metadata("design:paramtypes", [data_service_1.DataService, Object, Object])
    ], JsonFormsValidator);
    return JsonFormsValidator;
}());
exports.JsonFormsValidator = JsonFormsValidator;
//# sourceMappingURL=validation.service.js.map