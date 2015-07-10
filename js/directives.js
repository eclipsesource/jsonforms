/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>
var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
var JsonFormsDiretiveController = (function () {
    function JsonFormsDiretiveController(RenderService, ReferenceResolver, $scope, $q) {
        this.RenderService = RenderService;
        this.ReferenceResolver = ReferenceResolver;
        this.$scope = $scope;
        this.$q = $q;
        $q.all([this.fetchSchema().promise, this.fetchUiSchema().promise, this.fetchData()]).then(function (values) {
            var schema = values[0];
            var uiSchema = values[1];
            var data = values[2];
            console.log("data is " + JSON.stringify(data));
            schema['uiSchema'] = uiSchema;
            ReferenceResolver.addToMapping(JsonRefs.findRefs(uiSchema));
            JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                var ui = resolvedSchema["uiSchema"];
                $scope['elements'] = [RenderService.render(ui, schema, data, "#", $scope.asyncDataProvider)];
            });
        });
        // TODO
        $scope['opened'] = false;
        $scope['openDate'] = function ($event, element) {
            $event.preventDefault();
            $event.stopPropagation();
            element.isOpen = true;
        };
        $scope['validateNumber'] = function (value, element) {
            if (value !== undefined && value !== null && isNaN(value)) {
                element.alerts = [];
                var alert = {
                    type: 'danger',
                    msg: 'Must be a valid number!'
                };
                element.alerts.push(alert);
                return false;
            }
            element.alerts = [];
            return true;
        };
        $scope['validateInteger'] = function (value, element) {
            if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                element.alerts = [];
                var alert = {
                    type: 'danger',
                    msg: 'Must be a valid integer!'
                };
                element.alerts.push(alert);
                return false;
            }
            element.alerts = [];
            return true;
        };
    }
    JsonFormsDiretiveController.prototype.fetchSchema = function () {
        if (this.$scope.schema && this.$scope.asyncSchema()) {
            throw new Error("You cannot specify both the 'schema' and the 'async-schema' attribute at the same time.");
        }
        else if (this.$scope.schema) {
            var p = this.$q.defer();
            p.resolve(this.$scope.schema);
            return p;
        }
        else if (this.$scope.asyncSchema()) {
            return this.$scope.asyncSchema();
        }
        throw new Error("Either the 'schema' or the 'async-schema' attribute must be specified.");
    };
    JsonFormsDiretiveController.prototype.fetchUiSchema = function () {
        if (this.$scope.uiSchema && this.$scope.asyncUiSchema()) {
            throw new Error("You cannot specify both the 'ui-schema' and the 'async-ui-schema' attribute at the same time.");
        }
        else if (this.$scope.uiSchema) {
            var p = this.$q.defer();
            p.resolve(this.$scope.uiSchema);
            return p;
        }
        else if (this.$scope.asyncUiSchema()) {
            return this.$scope.asyncUiSchema();
        }
        throw new Error("Either the 'ui-schema' or the 'async-ui-schema' attribute must be specified.");
    };
    JsonFormsDiretiveController.prototype.fetchData = function () {
        var dataProvider = this.$scope.asyncDataProvider;
        var data = this.$scope.data;
        if (dataProvider && data) {
            throw new Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time.");
        }
        else if (dataProvider) {
            var prom = dataProvider.fetchData();
            return prom.$promise;
        }
        else if (this.$scope.data) {
            var p = this.$q.defer();
            p.resolve(this.$scope.data);
            return p.promise;
        }
        throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.");
    };
    JsonFormsDiretiveController.$inject = ['RenderService', 'ReferenceResolver', '$scope', '$q'];
    return JsonFormsDiretiveController;
})();
var RecElement = (function () {
    function RecElement(recursionHelper) {
        var _this = this;
        this.recursionHelper = recursionHelper;
        this.restrict = "E";
        this.replace = true;
        this.scope = {
            element: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        };
        this.templateUrl = 'templates/element.html';
        this.compile = function (element, attr, trans) {
            return _this.recursionHelper.compile(element, trans);
        };
    }
    return RecElement;
})();
jsonFormsDirectives.directive('control', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            control: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        },
        templateUrl: 'templates/control.html'
    };
}).directive('jsonforms', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: '=',
            uiSchema: '=',
            data: '=',
            asyncSchema: '&',
            asyncUiSchema: '&',
            asyncDataProvider: '='
        },
        // TODO: fix template for tests
        templateUrl: 'templates/form.html',
        controller: JsonFormsDiretiveController
    };
}).directive('recelement', ['RecursionHelper', function (recHelper) {
    return new RecElement(recHelper);
}]);
//# sourceMappingURL=directives.js.map