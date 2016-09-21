"use strict";
var pathutil_1 = require('../../services/pathutil');
var path_resolver_1 = require('../../services/path-resolver/path-resolver');
var services_1 = require('../../services/services');
var Labels_1 = require('../Labels');
var AbstractControl = (function () {
    function AbstractControl(scope) {
        var _this = this;
        this.scope = scope;
        this.alerts = [];
        this.services = scope['services'];
        this.uiSchema = scope['uischema'];
        this.schema = this.services.get(services_1.ServiceId.SchemaProvider).getSchema();
        this.data = this.services.get(services_1.ServiceId.DataProvider).getData();
        var indexedSchemaPath = this.uiSchema['scope']['$ref'];
        this.schemaPath = pathutil_1.PathUtil.filterIndexes(indexedSchemaPath);
        this.fragment = path_resolver_1.PathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.resolvedData = path_resolver_1.PathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);
        this.resolvedSchema = path_resolver_1.PathResolver.resolveSchema(this.schema, this.schemaPath);
        this.showLabel = Labels_1.LabelObjectUtil.shouldShowLabel(this.uiSchema);
        this.label = AbstractControl.createLabel(this.uiSchema, this.schemaPath, AbstractControl.isRequired(this.schema, this.schemaPath));
        this.scope.$on('jsonforms:change', function () {
            if (_this.validate) {
                _this.validate();
            }
            _this.services.get(services_1.ServiceId.RuleService).reevaluateRules(_this.schemaPath);
        });
        this.instance = this.data;
        this.rule = this.uiSchema.rule;
        this.services.get(services_1.ServiceId.RuleService).addRuleTrack(this);
    }
    Object.defineProperty(AbstractControl.prototype, "id", {
        get: function () {
            return this.schemaPath;
        },
        enumerable: true,
        configurable: true
    });
    AbstractControl.createLabel = function (uischema, schemaPath, isRequiredProperty) {
        var labelObject = Labels_1.LabelObjectUtil.getElementLabelObject(uischema, schemaPath);
        var stringBuilder = labelObject.text;
        if (isRequiredProperty) {
            stringBuilder += '*';
        }
        return stringBuilder;
    };
    AbstractControl.prototype.triggerChangeEvent = function () {
        this.scope.$root.$broadcast('jsonforms:change');
    };
    AbstractControl.prototype.validate = function () {
        var validationService = this.services.get(services_1.ServiceId.Validation);
        validationService.validate(this.data, this.schema);
        var result = validationService.getResult(this.data, '/' + pathutil_1.PathUtil.normalize(this.schemaPath));
        this.alerts = [];
        if (result !== undefined) {
            var alert_1 = {
                type: 'danger',
                msg: result
            };
            this.alerts.push(alert_1);
        }
    };
    AbstractControl.isRequired = function (schema, schemaPath) {
        var path = pathutil_1.PathUtil.init(schemaPath);
        var lastFragment = pathutil_1.PathUtil.lastFragment(path);
        if (lastFragment === 'properties') {
            path = pathutil_1.PathUtil.init(path);
        }
        var subSchema = path_resolver_1.PathResolver.resolveSchema(schema, path + '/required');
        if (subSchema !== undefined) {
            if (subSchema.indexOf(pathutil_1.PathUtil.lastFragment(schemaPath)) !== -1) {
                return true;
            }
        }
        return false;
    };
    return AbstractControl;
}());
exports.AbstractControl = AbstractControl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.control.base', ['jsonforms.renderers.controls'])
    .factory('BaseController', function () { return AbstractControl; })
    .name;
//# sourceMappingURL=abstract-control.js.map