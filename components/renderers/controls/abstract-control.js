var pathutil_1 = require('../../services/pathutil');
var jsonforms_pathresolver_1 = require('../../services/pathresolver/jsonforms-pathresolver');
var renderer_service_1 = require('../renderer-service');
var services_1 = require('../../services/services');
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
function schemaTypeIs(expected) {
    return function (uiSchema, schema, data) {
        var schemaPath = uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        if (schemaPath === undefined) {
            return false;
        }
        var currentDataSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(schema, schemaPath);
        if (currentDataSchema === undefined) {
            return false;
        }
        return currentDataSchema.type === expected;
    };
}
exports.schemaTypeIs = schemaTypeIs;
function uiTypeIs(expected) {
    return function (uiSchema, schema, data) {
        return uiSchema.type === expected;
    };
}
exports.uiTypeIs = uiTypeIs;
function optionIs(optionName, expected) {
    return function (uiSchema, schema, data) {
        var options = uiSchema['options'];
        if (options === undefined) {
            return false;
        }
        return options[optionName] === expected;
    };
}
exports.optionIs = optionIs;
function schemaTypeMatches(check) {
    return function (uiSchema, schema, data) {
        var schemaPath = uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        var currentDataSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(schema, schemaPath);
        return check(currentDataSchema);
    };
}
exports.schemaTypeMatches = schemaTypeMatches;
function schemaPathEndsWith(expected) {
    return function (uiSchema, schema, data) {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        return _.endsWith(uiSchema['scope']['$ref'], expected);
    };
}
exports.schemaPathEndsWith = schemaPathEndsWith;
function schemaPropertyName(expected) {
    return function (uiSchema, schema, data) {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        var schemaPath = uiSchema['scope']['$ref'];
        return _.last(schemaPath.split("/")) === expected;
    };
}
exports.schemaPropertyName = schemaPropertyName;
function always(uiSchema, schema, data) {
    return true;
}
exports.always = always;
var RendererTesterBuilder = (function () {
    function RendererTesterBuilder() {
    }
    RendererTesterBuilder.prototype.and = function () {
        var testers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            testers[_i - 0] = arguments[_i];
        }
        return function (uiSchema, schema, data) {
            return testers.reduce(function (acc, tester) { return acc && tester(uiSchema, schema, data); }, true);
        };
    };
    RendererTesterBuilder.prototype.create = function (test, spec) {
        return function (uiSchema, schema, data) {
            if (test(uiSchema, schema, data)) {
                return spec;
            }
            return renderer_service_1.NOT_FITTING;
        };
    };
    return RendererTesterBuilder;
})();
exports.RendererTesterBuilder = RendererTesterBuilder;
exports.Testers = new RendererTesterBuilder();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.control.base', ['jsonforms.renderers.controls'])
    .factory('BaseController', function () { return AbstractControl; })
    .service('JSONFormsTesters', function () {
    return {
        schemaPathEndsWith: schemaPathEndsWith,
        schemaPropertyName: schemaPropertyName,
        schemaTypeMatches: schemaTypeMatches,
        uiTypeIs: uiTypeIs,
        schemaTypeIs: schemaTypeIs,
        optionIs: optionIs,
        and: exports.Testers.and
    };
})
    .name;
//# sourceMappingURL=abstract-control.js.map