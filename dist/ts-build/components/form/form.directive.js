"use strict";
require('angular');
var JsonRefs = require('json-refs');
var services_1 = require('../services/services');
var services_2 = require('../services/services');
var services_3 = require('../services/services');
var services_4 = require('../services/services');
var rule_service_1 = require('../services/rule/rule-service');
var default_data_providers_1 = require('../services/data/default-data-providers');
var FormController = (function () {
    function FormController(rendererService, UISchemaRegistry, dataService, SchemaGenerator, $compile, $q, scope, timeout) {
        this.rendererService = rendererService;
        this.UISchemaRegistry = UISchemaRegistry;
        this.dataService = dataService;
        this.SchemaGenerator = SchemaGenerator;
        this.$compile = $compile;
        this.$q = $q;
        this.scope = scope;
        this.timeout = timeout;
        this.isInitialized = false;
    }
    FormController.isDataProvider = function (testMe) {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    };
    FormController.prototype.init = function () {
        var _this = this;
        if (this.isInitialized) {
            var children = angular.element(this.element.find('form')).children();
            children.remove();
            if (this.childScope !== undefined) {
                this.childScope.$destroy();
            }
        }
        this.isInitialized = true;
        this.$q.all([
            this.fetch(this.scope.data),
            this.fetch(this.scope.schema),
            this.fetch(this.scope.uischema)])
            .then(function (values) {
            var data = values[0];
            var schema = values[1];
            var uischema = values[2];
            if (data === undefined) {
                throw new Error("The 'data' attribute must be specified.");
            }
            _this.dataService.setRoot(data);
            var s = schema === undefined ?
                _this.SchemaGenerator.generateDefaultSchema(data) :
                schema;
            var u = uischema === undefined ?
                _this.UISchemaRegistry.getBestUiSchema(s, data) :
                uischema;
            var unresolvedRefs = JsonRefs.findRefs(s);
            if (_.size(unresolvedRefs) === 0) {
                _this.render(s, data, u);
            }
            else {
                JsonRefs.resolveRefs(s).then(function (res) {
                    _this.render(res.resolved, data, u);
                    _this.scope.$digest();
                }, function (err) { return console.error(err.stack); });
            }
        });
    };
    FormController.prototype.render = function (schema, data, uischema) {
        var _this = this;
        var dataProvider;
        var services = new services_4.Services();
        services.add(new services_2.SchemaProvider(schema));
        services.add(new default_data_providers_1.DefaultDataProvider(this.$q, data));
        services.add(new services_3.ScopeProvider(this.scope));
        services.add(new services_1.ValidationService());
        services.add(new rule_service_1.RuleService());
        if (FormController.isDataProvider(this.scope.data)) {
            dataProvider = this.scope.data;
        }
        else {
            dataProvider = new default_data_providers_1.DefaultDataProvider(this.$q, data);
        }
        services.add(dataProvider);
        this.childScope = this.scope.$new();
        this.childScope['services'] = services;
        this.childScope['uischema'] = uischema;
        var template = this.rendererService.getBestComponent(uischema, schema, dataProvider.getData());
        var compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.timeout(function () { return _this.scope.$root.$broadcast('jsonforms:change'); }, 0);
    };
    FormController.prototype.fetch = function (any) {
        if (_.isFunction(any)) {
            var ret = any();
            if (this.isPromise(ret)) {
                return ret;
            }
            else {
                return this.$q.when(ret);
            }
        }
        else {
            return this.$q.when(any);
        }
    };
    FormController.prototype.isPromise = function (data) {
        return _.isFunction(data['then']);
    };
    FormController.$inject = ['RendererService', 'UiSchemaRegistry', 'DataService',
        'SchemaGenerator', '$compile', '$q', '$scope', '$timeout'];
    return FormController;
}());
exports.FormController = FormController;
var formTemplate = "\n<div>\n    <form role='form' class='jsf-form rounded'></form>\n</div>";
var JsonFormsDirective = (function () {
    function JsonFormsDirective(DataService) {
        var _this = this;
        this.DataService = DataService;
        this.restrict = 'E';
        this.templateUrl = 'form.html';
        this.controller = FormController;
        this.controllerAs = 'vm';
        this.scope = {
            schema: '=',
            uischema: '=',
            data: '='
        };
        this.link = function (scope, el, attrs, ctrl) {
            var parent = el.parent();
            if (parent === undefined && parent.controller('jsonforms') === undefined) {
                _this.DataService.unset();
            }
            ctrl.element = el;
            scope.$watchGroup(['data', 'uischema', 'schema'], function (newValue) {
                if (angular.isDefined(newValue)) {
                    ctrl.init();
                }
            });
        };
    }
    return JsonFormsDirective;
}());
exports.JsonFormsDirective = JsonFormsDirective;
var InnerFormController = (function () {
    function InnerFormController(rendererService, $compile, scope) {
        this.rendererService = rendererService;
        this.$compile = $compile;
        this.scope = scope;
    }
    InnerFormController.prototype.init = function () {
        var services = this.scope['services'];
        var data = services.get(services_4.ServiceId.DataProvider).getData();
        var schema = services.get(services_4.ServiceId.SchemaProvider).getSchema();
        var template = this.rendererService.getBestComponent(this.uischema, schema, data);
        this.scope['uischema'] = this.uischema;
        var compiledTemplate = this.$compile(template)(this.scope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('jsonforms:change');
    };
    InnerFormController.$inject = ['RendererService', '$compile', '$scope'];
    return InnerFormController;
}());
exports.InnerFormController = InnerFormController;
var JsonFormsInnerDirective = (function () {
    function JsonFormsInnerDirective() {
        this.restrict = 'E';
        this.templateUrl = 'form.html';
        this.controller = InnerFormController;
        this.controllerAs = 'vm';
        this.bindToController = {
            uischema: '='
        };
        this.scope = true;
        this.link = function (scope, el, attrs, ctrl) {
            ctrl.element = el;
            ctrl.init();
        };
    }
    return JsonFormsInnerDirective;
}());
exports.JsonFormsInnerDirective = JsonFormsInnerDirective;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.form.directives', ['jsonforms.form'])
    .directive('jsonforms', ['DataService', function (DataService) {
        return new JsonFormsDirective(DataService);
    }])
    .directive('jsonformsInner', function () { return new JsonFormsInnerDirective(); })
    .run(['$templateCache', function ($templateCache) {
        return $templateCache.put('form.html', formTemplate);
    }])
    .name;
//# sourceMappingURL=form.directive.js.map