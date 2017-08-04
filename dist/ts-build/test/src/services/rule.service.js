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
const uischema_1 = require("../models/uischema");
const path_util_1 = require("../path.util");
/**
 * Service that evaluates all rules upon a data change.
 */
let JsonFormsRuleService = class JsonFormsRuleService {
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
        this.initialRun = (data) => {
            Object.keys(this.pathToControlMap).forEach(key => {
                this.pathToControlMap[key].forEach(uischema => {
                    this.evaluate(uischema, data);
                });
            });
        };
        dataService.registerDataChangeListener(this);
        this.parseRules(uiSchema);
    }
    /**
     * @inheritDoc
     */
    needsNotificationAbout(uischema) {
        // TODO hack
        if (uischema === null) {
            return true;
        }
        return this.pathToControlMap.hasOwnProperty(uischema.scope.$ref);
    }
    /**
     * @inheritDoc
     */
    dataChanged(uischema, newValue, data) {
        if (uischema === null) {
            this.initialRun(data);
            return;
        }
        const elements = this.pathToControlMap[uischema.scope.$ref];
        elements.forEach(element => {
            this.evaluate(element, data);
        });
    }
    /**
     * @inheritDoc
     */
    dispose() {
        this.dataService.deregisterDataChangeListener(this);
    }
    parseRules(uiSchema) {
        if (uiSchema.hasOwnProperty('rule')) {
            const ref = uiSchema.rule.condition.scope.$ref;
            if (!this.pathToControlMap.hasOwnProperty(ref)) {
                this.pathToControlMap[ref] = [];
            }
            this.pathToControlMap[ref].push(uiSchema);
        }
        if (uiSchema.hasOwnProperty('elements')) {
            uiSchema.elements.forEach(element => {
                this.parseRules(element);
            });
        }
    }
    evaluate(uiSchema, data) {
        // TODO condition evaluation should be done somewhere else
        const condition = uiSchema.rule.condition;
        const ref = condition.scope.$ref;
        const pair = path_util_1.getValuePropertyPair(data, ref);
        const value = pair.instance[pair.property];
        const equals = value === condition.expectedValue;
        if (!uiSchema.hasOwnProperty('runtime')) {
            uiSchema.runtime = new runtime_1.Runtime();
        }
        const runtime = uiSchema.runtime;
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
    }
};
JsonFormsRuleService = __decorate([
    core_1.JsonFormsServiceElement({}),
    __metadata("design:paramtypes", [data_service_1.DataService, Object, Object])
], JsonFormsRuleService);
exports.JsonFormsRuleService = JsonFormsRuleService;
//# sourceMappingURL=rule.service.js.map