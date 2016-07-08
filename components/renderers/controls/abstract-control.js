var pathutil_1 = require('../../services/pathutil');
var renderer_service_1 = require('../renderer-service');
var services_1 = require('../../services/services');
var AbstractControl = (function () {
    function AbstractControl(scope, pathResolver) {
        var _this = this;
        this.scope = scope;
        this.pathResolver = pathResolver;
        this.alerts = [];
        this.services = scope['services'];
        this.uiSchema = scope['uischema'];
        this.schema = this.services.get(services_1.ServiceId.SchemaProvider).getSchema();
        this.data = this.services.get(services_1.ServiceId.DataProvider).getData();
        var indexedSchemaPath = this.uiSchema['scope']['$ref'];
        this.schemaPath = pathutil_1.PathUtil.filterIndexes(indexedSchemaPath);
        this.fragment = pathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.modelValue = pathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);
        this.scope.$on('modelChanged', function () {
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
            return LabelObjectUtil.shouldShowLabel(this.uiSchema.label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "label", {
        get: function () {
            var labelObject = LabelObjectUtil.getElementLabelObject(this.uiSchema.label, this.schemaPath);
            var stringBuilder = labelObject.text;
            if (this.isRequired(this.schemaPath)) {
                stringBuilder += '*';
            }
            return stringBuilder;
        },
        enumerable: true,
        configurable: true
    });
    AbstractControl.prototype.modelChanged = function () {
        this.scope.$root.$broadcast('modelChanged');
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
        var subSchema = this.pathResolver.resolveSchema(this.schema, path + '/required');
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
var LabelObjectUtil = (function () {
    function LabelObjectUtil() {
    }
    LabelObjectUtil.shouldShowLabel = function (label) {
        if (label === undefined) {
            return true;
        }
        else if (typeof label === 'boolean') {
            return label;
        }
        else if (typeof label === 'string') {
            return label !== '';
        }
        else {
            var labelObj = label;
            return labelObj.hasOwnProperty('show') ? labelObj.show : true;
        }
    };
    LabelObjectUtil.getElementLabelObject = function (labelProperty, schemaPath) {
        if (typeof labelProperty === 'boolean') {
            if (labelProperty) {
                return new LabelObject(pathutil_1.PathUtil.beautifiedLastFragment(schemaPath), labelProperty);
            }
            else {
                return new LabelObject(undefined, labelProperty);
            }
        }
        else if (typeof labelProperty === 'string') {
            return new LabelObject(labelProperty, true);
        }
        else if (typeof labelProperty === 'object') {
            var show = _.has(labelProperty, 'show') ?
                labelProperty.show : true;
            var label = _.has(labelProperty, 'text') ?
                labelProperty.text : pathutil_1.PathUtil.beautifiedLastFragment(schemaPath);
            return new LabelObject(label, show);
        }
        else {
            return new LabelObject(pathutil_1.PathUtil.beautifiedLastFragment(schemaPath), true);
        }
    };
    return LabelObjectUtil;
})();
exports.LabelObjectUtil = LabelObjectUtil;
var LabelObject = (function () {
    function LabelObject(text, show) {
        this.text = text;
        this.show = show;
    }
    return LabelObject;
})();
exports.ControlRendererTester = function (type, specificity) {
    return function (element, dataSchema, dataObject, pathResolver) {
        if (element.type !== 'Control') {
            return renderer_service_1.NOT_FITTING;
        }
        var currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
        if (currentDataSchema === undefined || currentDataSchema.type !== type) {
            return renderer_service_1.NOT_FITTING;
        }
        return specificity;
    };
};
//# sourceMappingURL=abstract-control.js.map