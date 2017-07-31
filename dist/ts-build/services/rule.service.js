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
var uischema_1 = require("../models/uischema");
var path_util_1 = require("../path.util");
/**
 * Service that evaluates all rules upon a data change.
 */
var JsonFormsRuleService = (function () {
    /**
     * Constructor.
     *
     * @param {DataService} dataService the data service
     * @param {JsonSchema} dataSchema the JSON schema describing the data
     * @param {UISchemaElement} uiSchema the UI schema to be rendered
     */
    function JsonFormsRuleService(dataService, dataSchema, uiSchema) {
        var _this = this;
        this.dataService = dataService;
        this.pathToControlMap = {};
        this.initialRun = function (data) {
            Object.keys(_this.pathToControlMap).forEach(function (key) {
                _this.pathToControlMap[key].forEach(function (uischema) {
                    _this.evaluate(uischema, data);
                });
            });
        };
        dataService.registerDataChangeListener(this);
        this.parseRules(uiSchema);
    }
    /**
     * @inheritDoc
     */
    JsonFormsRuleService.prototype.needsNotificationAbout = function (uischema) {
        // TODO hack
        if (uischema === null) {
            return true;
        }
        return this.pathToControlMap.hasOwnProperty(uischema.scope.$ref);
    };
    /**
     * @inheritDoc
     */
    JsonFormsRuleService.prototype.dataChanged = function (uischema, newValue, data) {
        var _this = this;
        if (uischema === null) {
            this.initialRun(data);
            return;
        }
        var elements = this.pathToControlMap[uischema.scope.$ref];
        elements.forEach(function (element) {
            _this.evaluate(element, data);
        });
    };
    /**
     * @inheritDoc
     */
    JsonFormsRuleService.prototype.dispose = function () {
        this.dataService.deregisterDataChangeListener(this);
    };
    JsonFormsRuleService.prototype.parseRules = function (uiSchema) {
        var _this = this;
        if (uiSchema.hasOwnProperty('rule')) {
            var ref = uiSchema.rule.condition.scope.$ref;
            if (!this.pathToControlMap.hasOwnProperty(ref)) {
                this.pathToControlMap[ref] = [];
            }
            this.pathToControlMap[ref].push(uiSchema);
        }
        if (uiSchema.hasOwnProperty('elements')) {
            uiSchema.elements.forEach(function (element) {
                _this.parseRules(element);
            });
        }
    };
    JsonFormsRuleService.prototype.evaluate = function (uiSchema, data) {
        // TODO condition evaluation should be done somewhere else
        var condition = uiSchema.rule.condition;
        var ref = condition.scope.$ref;
        var pair = path_util_1.getValuePropertyPair(data, ref);
        var value = pair.instance[pair.property];
        var equals = value === condition.expectedValue;
        if (!uiSchema.hasOwnProperty('runtime')) {
            uiSchema.runtime = new runtime_1.Runtime();
        }
        var runtime = uiSchema.runtime;
        switch (uiSchema.rule.effect) {
            case uischema_1.RuleEffect.HIDE:
                runtime.visible = !equals;
                break;
            case uischema_1.RuleEffect.SHOW:
                runtime.visible = equals;
                break;
            case uischema_1.RuleEffect.DISABLE:
                runtime.enabled = !equals;
                break;
            case uischema_1.RuleEffect.ENABLE:
                runtime.enabled = equals;
                break;
            default:
        }
    };
    JsonFormsRuleService = __decorate([
        core_1.JsonFormsServiceElement({}),
        __metadata("design:paramtypes", [data_service_1.DataService, Object, Object])
    ], JsonFormsRuleService);
    return JsonFormsRuleService;
}());
exports.JsonFormsRuleService = JsonFormsRuleService;
//# sourceMappingURL=rule.service.js.map