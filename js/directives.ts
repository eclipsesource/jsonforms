/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>

var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
declare var JsonRefs;

class JsonFormsDiretiveController {

    static $inject = ['RenderService', 'ReferenceResolver', 'SchemaGenerator', 'UISchemaGenerator', '$scope', '$q'];

    constructor(
        private RenderService:jsonforms.services.IRenderService,
        private ReferenceResolver:jsonforms.services.IReferenceResolver,
        private SchemaGenerator:jsonforms.services.ISchemaGenerator,
        private UISchemaGenerator:jsonforms.services.IUISchemaGenerator,
        private $scope:JsonFormsDirectiveScope,
        private $q: ng.IQService
    ) {

        var resolvedSchemaDeferred = $q.defer();
        var resolvedUISchemaDeferred = $q.defer();

        $q.all([this.fetchSchema().promise, this.fetchUiSchema().promise]).then(function(values) {
            var schema = values[0];
            var uiSchemaMaybe = values[1];

            var uiSchemaDeferred = $q.defer();

            $q.when(uiSchemaDeferred.promise).then(function (uiSchema) {
                schema['uiSchema'] = uiSchema;
                ReferenceResolver.addToMapping(JsonRefs.findRefs(uiSchema));
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    resolvedSchemaDeferred.resolve(resolvedSchema);
                    resolvedUISchemaDeferred.resolve(resolvedSchema['uiSchema']);
                });
            });

            if (uiSchemaMaybe === undefined || uiSchemaMaybe === null || uiSchemaMaybe === "") {
                // resolve JSON schema, then generate ui Schema
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    var uiSchema = UISchemaGenerator.generateDefaultUISchema(resolvedSchema);
                    uiSchemaDeferred.resolve(uiSchema);
                });
            } else {
                // directly resolve ui schema
                uiSchemaDeferred.resolve(uiSchemaMaybe);
            }
        });


        $q.all([resolvedSchemaDeferred.promise, resolvedUISchemaDeferred .promise, this.fetchData()]).then(function(values) {
            var schema = values[0];
            var uiSchema = values[1];
            var data = values[2];

            $scope['elements'] = [RenderService.render(uiSchema, schema, data, "#", $scope.asyncDataProvider)];
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

    private fetchSchema() {
        if (this.$scope.schema && this.$scope.asyncSchema()) {
            throw new Error("You cannot specify both the 'schema' and the 'async-schema' attribute at the same time.")
        } else if (this.$scope.schema) {
            var p: ng.IDeferred<any> = this.$q.defer<any>();
            p.resolve(this.$scope.schema);
            return p;
        } else if (this.$scope.asyncSchema()) {
            return this.$scope.asyncSchema();
        }

        throw new Error("Either the 'schema' or the 'async-schema' attribute must be specified.");
    }

    private fetchUiSchema() {

        if (this.$scope.uiSchema && this.$scope.asyncUiSchema()) {
            throw new Error("You cannot specify both the 'ui-schema' and the 'async-ui-schema' attribute at the same time.")
        } else if (this.$scope.uiSchema) {
            var p = this.$q.defer();
            p.resolve(this.$scope.uiSchema);
            return p;
        } else if (this.$scope.asyncUiSchema()) {
            return this.$scope.asyncUiSchema();
        }

        // throw new Error("Either the 'ui-schema' or the 'async-ui-schema' attribute must be specified.");

        // return undefined to indicate that no way of obtaining a ui schema was defined
        // TODO: Maybe return defaultUISchema or generator function?
        var p = this.$q.defer();
        p.resolve(undefined);
        return p;
    }

    private fetchData() {
        var dataProvider: jsonforms.services.IDataProvider = <jsonforms.services.IDataProvider> this.$scope.asyncDataProvider;
        var data = this.$scope.data;

        if (dataProvider && data) {
            throw new Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time.")
        } else if (dataProvider) {
            var prom = dataProvider.fetchData();
            return prom.$promise;
        } else if (this.$scope.data) {
            var p = this.$q.defer();
            p.resolve(this.$scope.data);
            return p.promise;
        }

        throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.")
    }
}

interface JsonFormsDirectiveScope extends ng.IScope {

    schema: string;
    uiSchema: string;
    data: string;

    asyncSchema: () => any;
    asyncUiSchema: () => any;
    asyncDataProvider: jsonforms.services.IDataProvider;
}

class RecElement implements ng.IDirective {

    constructor(private recursionHelper:jsonforms.services.RecursionHelper) {
    }

    restrict = "E";
    replace = true;
    scope = {
        element: '=',
        bindings: '=',
        topOpenDate: '=',
        topValidateNumber: '=',
        topValidateInteger: '='
    };
    templateUrl = 'templates/element.html';

    compile: ng.IDirectiveCompileFn = (element, attr, trans) => {
        return <ng.IDirectivePrePost>this.recursionHelper.compile(element, trans);
    };

}

jsonFormsDirectives.directive('control', function ():ng.IDirective {

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
}).directive('jsonforms', function ():ng.IDirective {

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
    }
}).directive('recelement', ['RecursionHelper', (recHelper: jsonforms.services.RecursionHelper): ng.IDirective => {
    return new RecElement(recHelper);
}]);
