/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>

var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
declare var JsonRefs;

class JsonFormsDirectiveController {

    static $inject = ['JSONForms.RenderService', 'ReferenceResolver', 'UISchemaGenerator', 'SchemaGenerator', '$scope', '$q'];

    constructor(
        private RenderService: JSONForms.IRenderService,
        private ReferenceResolver: JSONForms.IReferenceResolver,
        private UISchemaGenerator: JSONForms.IUISchemaGenerator,
        private SchemaGenerator: JSONForms.ISchemaGenerator,
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
                //schema['uiSchema'] = uiSchema;
                //  build mapping of ui paths to schema refs
                //ReferenceResolver.addUiPathToSchemaRefMapping(JsonRefs.findRefs(uiSchema));
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    resolvedSchemaDeferred.resolve(resolvedSchema);
                    // TODO: ui schema is now unresolved
                    resolvedUISchemaDeferred.resolve(uiSchema); //resolvedSchema['uiSchema']);
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

            var dataProvider: JSONForms.IDataProvider;
            if ($scope.asyncDataProvider) {
                dataProvider = $scope.asyncDataProvider;
            } else {
                dataProvider = new JSONForms.DefaultDataProvider($q, data);
            }

            RenderService.registerSchema(schema);
            $scope['elements'] = [RenderService.render(uiSchema, dataProvider)];
        });

        // TODO: check if still in use
        $scope['opened'] = false;
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
        } else if (this.$scope.data) {
            var p: ng.IDeferred<any> = this.$q.defer<any>();
            p.resolve(this.SchemaGenerator.generateDefaultSchema(this.$scope.data));
            return p;
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

        // return undefined to indicate that no way of obtaining a ui schema was defined
        // TODO: Maybe return defaultUISchema or generator function?
        var p = this.$q.defer();
        p.resolve(undefined);
        return p;
    }

    private fetchData() {
        var dataProvider: JSONForms.IDataProvider = <JSONForms.IDataProvider> this.$scope.asyncDataProvider;
        var data = this.$scope.data;

        if (dataProvider && data) {
            throw new Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time.")
        } else if (dataProvider) {
            var prom = dataProvider.fetchData();
            return prom;
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
    asyncDataProvider: JSONForms.IDataProvider;
}

class RecElement implements ng.IDirective {

    constructor(private recursionHelper:JSONForms.RecursionHelper) {
    }

    restrict = "E";
    replace = true;
    scope = { element: '=' };
    templateUrl = 'templates/element.html';

    compile: ng.IDirectiveCompileFn = (element, attr, trans) => {
        return <ng.IDirectivePrePost>this.recursionHelper.compile(element, trans);
    };

}

jsonFormsDirectives.directive('control', function ():ng.IDirective {

    return {
        restrict: "E",
        replace: true,
        scope: { control: '=' },
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
        controller: JsonFormsDirectiveController
    }
}).directive('recelement', ['RecursionHelper', (recHelper: JSONForms.RecursionHelper): ng.IDirective => {
    return new RecElement(recHelper);
}]).directive('dynamicWidget', ['$compile', function ($compile: ng.ICompileService) {
    var replaceJSONFormsAttributeInTemplate = (template: string): string => {
        return template
            .replace("data-jsonforms-model",      "ng-model='element.instance[element.path]'")
            .replace("data-jsonforms-validation", `ng-change='element.validate()'`);
    };
    return {
        restrict: 'E',
        scope: {
            element: "="
        },
        replace: true,
        link: function(scope, element) {
            if (scope.element.templateUrl) {
                $.get(scope.element.templateUrl, function(template) {
                    var updatedTemplate = replaceJSONFormsAttributeInTemplate(template);
                    var compiledTemplate = $compile(updatedTemplate)(scope);
                    element.replaceWith(compiledTemplate);
                })
            } else {
                var updatedTemplate = replaceJSONFormsAttributeInTemplate(scope.element.template);
                var template = $compile(updatedTemplate)(scope);
                element.replaceWith(template);
            }
        }
    }
}]);
