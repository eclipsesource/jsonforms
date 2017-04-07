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
var uischema_1 = require("../models/uischema");
var core_1 = require("../core");
var path_util_1 = require("../path.util");
var runtime_1 = require("../core/runtime");
var data_service_1 = require("../core/data.service");
var JsonFormsRuleService = (function () {
    function JsonFormsRuleService(dataService, dataSchema, uiSchema) {
        this.dataService = dataService;
        this.pathToControlMap = {};
        dataService.registerChangeListener(this);
        this.parseRules(uiSchema);
    }
    JsonFormsRuleService.prototype.isRelevantKey = function (uischema) {
        // TODO hack
        if (uischema === null) {
            return true;
        }
        return this.pathToControlMap.hasOwnProperty(uischema.scope.$ref);
    };
    JsonFormsRuleService.prototype.notifyChange = function (uischema, newValue, data) {
        var _this = this;
        if (uischema === null) {
            this.initialRun(data);
            return;
        }
        var elements = this.pathToControlMap[uischema.scope.$ref];
        elements.forEach(function (element) { return _this.evaluate(element, data); });
    };
    JsonFormsRuleService.prototype.dispose = function () {
        this.dataService.unregisterChangeListener(this);
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
            uiSchema.elements.forEach(function (element) { return _this.parseRules(element); });
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
            var runtime_2 = new runtime_1.Runtime();
            uiSchema['runtime'] = runtime_2;
        }
        var runtime = uiSchema['runtime'];
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
        }
    };
    JsonFormsRuleService.prototype.initialRun = function (data) {
        var _this = this;
        Object.keys(this.pathToControlMap).forEach(function (key) { return _this.pathToControlMap[key].forEach(function (uischema) { return _this.evaluate(uischema, data); }); });
    };
    return JsonFormsRuleService;
}());
JsonFormsRuleService = __decorate([
    core_1.JsonFormsServiceElement({}),
    __metadata("design:paramtypes", [data_service_1.DataService, Object, Object])
], JsonFormsRuleService);
exports.JsonFormsRuleService = JsonFormsRuleService;
//# sourceMappingURL=rule.service.js.map