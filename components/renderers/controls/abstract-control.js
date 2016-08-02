var pathutil_1 = require('../../services/pathutil');
var jsonforms_pathresolver_1 = require('../../services/pathresolver/jsonforms-pathresolver');
var services_1 = require('../../services/services');
var Labels_1 = require("../Labels");
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
        this.fragment = jsonforms_pathresolver_1.PathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.resolvedData = jsonforms_pathresolver_1.PathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);
        this.resolvedSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, this.schemaPath);
        this.scope.$on('jsonforms:change', function () {
            _this.validate();
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
    Object.defineProperty(AbstractControl.prototype, "showLabel", {
        get: function () {
            return Labels_1.LabelObjectUtil.shouldShowLabel(this.uiSchema.label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "label", {
        get: function () {
            var labelObject = Labels_1.LabelObjectUtil.getElementLabelObject(this.uiSchema.label, this.schemaPath);
            var stringBuilder = labelObject.text;
            if (this.isRequired(this.schemaPath)) {
                stringBuilder += '*';
            }
            return stringBuilder;
        },
        enumerable: true,
        configurable: true
    });
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
    AbstractControl.prototype.isRequired = function (schemaPath) {
        var path = pathutil_1.PathUtil.init(schemaPath);
        var lastFragment = pathutil_1.PathUtil.lastFragment(path);
        if (lastFragment === 'properties') {
            path = pathutil_1.PathUtil.init(path);
        }
        var subSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, path + '/required');
        if (subSchema !== undefined) {
            if (subSchema.indexOf(pathutil_1.PathUtil.lastFragment(schemaPath)) !== -1) {
                return true;
            }
        }
        return false;
    };
    return AbstractControl;
})();
exports.AbstractControl = AbstractControl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.control.base', ['jsonforms.renderers.controls'])
    .factory('BaseController', function () { return AbstractControl; })
    .name;
//# sourceMappingURL=abstract-control.js.map