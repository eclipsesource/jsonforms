require('angular');
var JsonRefs = require('json-refs');
var jsonforms_pathresolver_1 = require('../services/pathresolver/jsonforms-pathresolver');
var services_1 = require('../services/services');
var services_2 = require('../services/services');
var services_3 = require('../services/services');
var services_4 = require('../services/services');
var services_5 = require('../services/services');
var rule_service_1 = require('../services/rule/rule-service');
var data_services_1 = require('../services/data/data-services');
var FormController = (function () {
    function FormController(rendererService, PathResolver, UISchemaRegistry, SchemaGenerator, $compile, $q, scope) {
        this.rendererService = rendererService;
        this.PathResolver = PathResolver;
        this.UISchemaRegistry = UISchemaRegistry;
        this.SchemaGenerator = SchemaGenerator;
        this.$compile = $compile;
        this.$q = $q;
        this.scope = scope;
        this.isInitialized = false;
    }
    FormController.isDataProvider = function (testMe) {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    };
    FormController.isUiSchemaProvider = function (testMe) {
        return testMe !== undefined && testMe.hasOwnProperty('fetchUiSchema');
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
        var resolvedSchemaDeferred = this.$q.defer();
        var resolvedUISchemaDeferred = this.$q.defer();
        this.$q.all([this.fetchSchema(), this.fetchUiSchema()]).then(function (values) {
            var schema = values[0];
            _this.uiSchema = values[1];
            if (_this.uiSchema === undefined) {
                _this.uiSchema = _this.UISchemaRegistry.getBestUiSchema(schema);
            }
            resolvedSchemaDeferred.resolve(schema);
            resolvedUISchemaDeferred.resolve(_this.uiSchema);
        });
        this.$q.all([
            resolvedSchemaDeferred.promise,
            resolvedUISchemaDeferred.promise,
            this.fetchData()]).then(function (values) {
            var schema = values[0];
            _this.uiSchema = values[1];
            var data = values[2];
            var unresolvedRefs = JsonRefs.findRefs(schema);
            if (_.size(unresolvedRefs) === 0) {
                _this.render(schema, data);
            }
            else {
                JsonRefs.resolveRefs(schema).then(function (res) {
                    _this.render(res.resolved, data);
                    _this.scope.$digest();
                }, function (err) {
                    console.log(err.stack);
                });
            }
        });
    };
    FormController.prototype.render = function (schema, data) {
        var dataProvider;
        var services = new services_5.Services();
        services.add(new services_4.PathResolverService(new jsonforms_pathresolver_1.PathResolver()));
        services.add(new services_3.ScopeProvider(this.scope));
        services.add(new services_2.SchemaProvider(schema));
        services.add(new services_1.ValidationService());
        services.add(new rule_service_1.RuleService(this.PathResolver));
        if (FormController.isDataProvider(this.scope.data)) {
            dataProvider = this.scope.data;
        }
        else {
            dataProvider = new data_services_1.DefaultDataProvider(this.$q, data);
        }
        services.add(dataProvider);
        this.childScope = this.scope.$new();
        this.childScope['services'] = services;
        this.childScope['uischema'] = this.uiSchema;
        var template = this.rendererService.getBestComponent(this.uiSchema, schema, dataProvider.getData());
        var compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
    };
    FormController.prototype.fetchSchema = function () {
        if (typeof this.scope.schema === 'object') {
            return this.$q.when(this.scope.schema);
        }
        else if (this.scope.schema !== undefined) {
            return this.scope.schema();
        }
        else {
            return this.$q.when(this.SchemaGenerator.generateDefaultSchema(this.scope.data));
        }
    };
    FormController.prototype.fetchUiSchema = function () {
        if (FormController.isUiSchemaProvider(this.scope.uischema)) {
            return this.scope.uischema.getUiSchema();
        }
        else if (typeof this.scope.uischema === 'object') {
            return this.$q.when(this.scope.uischema);
        }
        return this.$q.when(undefined);
    };
    FormController.prototype.fetchData = function () {
        if (FormController.isDataProvider(this.scope.data)) {
            return this.scope.data.fetchData();
        }
        else if (typeof this.scope.data === 'object') {
            return this.$q.when(this.scope.data);
        }
        throw new Error("The 'data' attribute must be specified.");
    };
    FormController.$inject = ['RendererService', 'PathResolver', 'UiSchemaRegistry',
        'SchemaGenerator', '$compile', '$q', '$scope'];
    return FormController;
})();
exports.FormController = FormController;
var formTemplate = "\n<div>\n    <form role='form' class='jsf-form rounded'></form>\n</div>";
var JsonFormsDirective = (function () {
    function JsonFormsDirective() {
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
        var data = services.get(services_5.ServiceId.DataProvider).getData();
        var schema = services.get(services_5.ServiceId.SchemaProvider).getSchema();
        var template = this.rendererService.getBestComponent(this.uischema, schema, data);
        this.scope['uischema'] = this.uischema;
        var compiledTemplate = this.$compile(template)(this.scope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
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
    .directive('jsonforms', function () { return new JsonFormsDirective(); })
    .directive('jsonformsInner', function () { return new JsonFormsInnerDirective(); })
    .run(['$templateCache', function ($templateCache) {
        return $templateCache.put('form.html', formTemplate);
    }])
    .name;
//# sourceMappingURL=form-directive.js.map