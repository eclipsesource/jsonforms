require('angular');
var JsonRefs = require('json-refs');
var services_1 = require('../services/services');
var services_2 = require('../services/services');
var services_3 = require('../services/services');
var services_4 = require('../services/services');
var rule_service_1 = require('../services/rule/rule-service');
var data_services_1 = require('../services/data/data-services');
var FormController = (function () {
    function FormController(rendererService, UISchemaRegistry, RootDataService, SchemaGenerator, $compile, $q, scope) {
        this.rendererService = rendererService;
        this.UISchemaRegistry = UISchemaRegistry;
        this.RootDataService = RootDataService;
        this.SchemaGenerator = SchemaGenerator;
        this.$compile = $compile;
        this.$q = $q;
        this.scope = scope;
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
            this.fetchData(this.scope.data),
            this.fetchSchema(this.scope.schema),
            this.fetchUiSchema(this.scope.uischema)])
            .then(function (values) {
            var data = values[0];
            var schema = values[1];
            var uischema = values[2];
            if (data === undefined) {
                throw new Error("The 'data' attribute must be specified.");
            }
            _this.RootDataService.setData(data);
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
        var dataProvider;
        var services = new services_4.Services();
        services.add(new services_2.SchemaProvider(schema));
        services.add(new data_services_1.DefaultDataProvider(this.$q, data));
        services.add(new services_3.ScopeProvider(this.scope));
        services.add(new services_1.ValidationService());
        services.add(new rule_service_1.RuleService());
        if (FormController.isDataProvider(this.scope.data)) {
            dataProvider = this.scope.data;
        }
        else {
            dataProvider = new data_services_1.DefaultDataProvider(this.$q, data);
        }
        services.add(dataProvider);
        this.childScope = this.scope.$new();
        this.childScope['services'] = services;
        this.childScope['uischema'] = uischema;
        var template = this.rendererService.getBestComponent(uischema, schema, dataProvider.getData());
        var compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('jsonforms:change');
    };
    FormController.prototype.fetchSchema = function (schema) {
        if (typeof schema === 'function') {
            return this.$q.when(schema());
        }
        else {
            return this.$q.when(schema);
        }
    };
    FormController.prototype.fetchUiSchema = function (uischema) {
        if (typeof uischema === 'function') {
            return this.$q.when(uischema());
        }
        else {
            return this.$q.when(uischema);
        }
    };
    FormController.prototype.fetchData = function (data) {
        if (typeof data === 'function') {
            return this.$q.when(data());
        }
        else {
            return this.$q.when(data);
        }
    };
    FormController.$inject = ['RendererService', 'UiSchemaRegistry', 'RootDataService',
        'SchemaGenerator', '$compile', '$q', '$scope'];
    return FormController;
})();
exports.FormController = FormController;
var formTemplate = "\n<div>\n    <form role='form' class='jsf-form rounded'></form>\n</div>";
var JsonFormsDirective = (function () {
    function JsonFormsDirective(RootDataService) {
        var _this = this;
        this.RootDataService = RootDataService;
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
                _this.RootDataService.unset();
            }
            ctrl.element = el;
            scope.$watchGroup(['data', 'uischema'], function (newValue) {
                if (angular.isDefined(newValue)) {
                    ctrl.init();
                }
            });
        };
    }
    return JsonFormsDirective;
})();
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
})();
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
})();
exports.JsonFormsInnerDirective = JsonFormsInnerDirective;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms.form.directives', ['jsonforms.form'])
    .directive('jsonforms', ['RootDataService', function (RootDataService) {
        return new JsonFormsDirective(RootDataService);
    }])
    .directive('jsonformsInner', function () { return new JsonFormsInnerDirective(); })
    .run(['$templateCache', function ($templateCache) {
        return $templateCache.put('form.html', formTemplate);
    }])
    .name;
//# sourceMappingURL=form-directive.js.map