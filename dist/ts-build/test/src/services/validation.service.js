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
const core_1 = require("../core");
const data_service_1 = require("../core/data.service");
const runtime_1 = require("../core/runtime");
const path_util_1 = require("../path.util");
const AJV = require("ajv");
const ajv = new AJV({ allErrors: true, jsonPointers: true, errorDataPath: 'property' });
/**
 * Validator service based on ajv.
 */
let JsonFormsValidator = class JsonFormsValidator {
    /**
     * Constructor.
     *
     * @param {DataService} dataService the data service
     * @param {JsonSchema} dataSchema the JSON schema describing the data
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     */
    constructor(dataService, dataSchema, uiSchema) {
        this.dataService = dataService;
        this.pathToControlMap = {};
        /**
         * @inheritDoc
         */
        this.dataChanged = (uischema, newValue, data) => {
            this.validate(data);
        };
        /**
         * @inheritDoc
         */
        this.dispose = () => {
            this.dataService.deregisterDataChangeListener(this);
        };
        dataService.registerDataChangeListener(this);
        this.validator = ajv.compile(dataSchema);
        this.parseUiSchema(uiSchema);
    }
    /**
     * @inheritDoc
     */
    needsNotificationAbout(_) {
        return true;
    }
    parseUiSchema(uiSchema) {
        if (uiSchema.hasOwnProperty('elements')) {
            uiSchema.elements.forEach(element => {
                this.parseUiSchema(element);
            });
        }
        else if (uiSchema.hasOwnProperty('scope')) {
            const control = uiSchema;
            const instancePath = path_util_1.toDataPath(control.scope.$ref);
            this.pathToControlMap[instancePath] = control;
        }
    }
    validate(data) {
        this.cleanAllValidationErrors();
        const valid = this.validator(data);
        if (valid) {
            return;
        }
        const errors = this.validator.errors;
        errors.forEach(error => {
            this.mapErrorToControl(error);
        });
    }
    mapErrorToControl(error) {
        const uiSchema = this.pathToControlMap[error.dataPath.substring(1)];
        if (uiSchema === undefined) {
            // FIXME should we log this at all?
            console.warn('No control for showing validation error @', error.dataPath.substring(1));
            return;
        }
        if (!uiSchema.hasOwnProperty('runtime')) {
            uiSchema.runtime = new runtime_1.Runtime();
        }
        const runtime = uiSchema.runtime;
        runtime.validationErrors = [];
        runtime.validationErrors = runtime.validationErrors.concat(error.message);
    }
    cleanAllValidationErrors() {
        Object.keys(this.pathToControlMap).forEach(key => {
            if (!this.pathToControlMap[key].hasOwnProperty('runtime')) {
                return;
            }
            (this.pathToControlMap[key].runtime).validationErrors = undefined;
        });
    }
};
JsonFormsValidator = __decorate([
    core_1.JsonFormsServiceElement({}),
    __metadata("design:paramtypes", [data_service_1.DataService, Object, Object])
], JsonFormsValidator);
exports.JsonFormsValidator = JsonFormsValidator;
//# sourceMappingURL=validation.service.js.map