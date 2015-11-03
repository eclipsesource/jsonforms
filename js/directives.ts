/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>

var jsonFormsDirectives = angular.module('jsonforms.directives', ['jsonforms.services']);
declare var JsonRefs;

class JsonFormsDirectiveController {

    static $inject = ['RenderService', 'PathResolver', 'UISchemaGenerator', 'SchemaGenerator', '$scope', '$q'];

    private isInitialized = false;

    constructor(
        private RenderService: JSONForms.IRenderService,
        private PathResolver: JSONForms.IPathResolver,
        private UISchemaGenerator: JSONForms.IUISchemaGenerator,
        private SchemaGenerator: JSONForms.ISchemaGenerator,
        private $scope:JsonFormsDirectiveScope,
        private $q: ng.IQService
    ) { }

    public init() {

        if (this.isInitialized) {
            // remove previously rendered elements
            var children = angular.element(this.$scope['element'].find('form')).children();
            children.remove();
        }

        this.isInitialized = true;

        var resolvedSchemaDeferred = this.$q.defer();
        var resolvedUISchemaDeferred = this.$q.defer();

        this.$q.all([this.fetchSchema().promise, this.fetchUiSchema().promise]).then((values) => {
            var schema = values[0];
            var uiSchemaMaybe = values[1];

            var uiSchemaDeferred = this.$q.defer();

            this.$q.when(uiSchemaDeferred.promise).then((uiSchema) => {
                //schema['uiSchema'] = uiSchema;
                //  build mapping of ui paths to schema refs
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    resolvedSchemaDeferred.resolve(resolvedSchema);
                    // TODO: ui schema is now unresolved
                    resolvedUISchemaDeferred.resolve(uiSchema); //resolvedSchema['uiSchema']);
                });
            });

            if (uiSchemaMaybe === undefined || uiSchemaMaybe === null || uiSchemaMaybe === "") {
                // resolve JSON schema, then generate ui Schema
                JsonRefs.resolveRefs(schema, {}, (err, resolvedSchema, meta) => {
                    var uiSchema = this.UISchemaGenerator.generateDefaultUISchema(resolvedSchema);
                    uiSchemaDeferred.resolve(uiSchema);
                });
            } else {
                // directly resolve ui schema
                uiSchemaDeferred.resolve(uiSchemaMaybe);
            }
        });


        this.$q.all([resolvedSchemaDeferred.promise, resolvedUISchemaDeferred .promise, this.fetchData()]).then((values) => {
            var schema = values[0];
            var uiSchema = values[1];
            var data = values[2];

            var dataProvider: JSONForms.IDataProvider;
            if (this.$scope.asyncDataProvider) {
                dataProvider = this.$scope.asyncDataProvider;
            } else {
                dataProvider = new JSONForms.DefaultDataProvider(this.$q, data);
            }

            this.RenderService.registerSchema(schema);
            this.$scope['elements'] = [this.RenderService.render(uiSchema, dataProvider)];
        });
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
            return dataProvider.fetchData();
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

jsonFormsDirectives.directive('jsonforms', ():ng.IDirective => {

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
            controller: JsonFormsDirectiveController,
            link: (scope, el, attrs, ctrl) => {
                scope['element'] = el;
                scope.$watch('uiSchema', () => { ctrl.init(); });
            }
        }
    })
    .directive('dynamicWidget', ['$compile', '$templateRequest', function ($compile: ng.ICompileService, $templateRequest: ng.ITemplateRequestService) {
        var replaceJSONFormsAttributeInTemplate = (template, fragments): string => {
            var path = [];
            for (var fragment in fragments) {
                path.push("['" + fragments[fragment] + "']");
            }
            var pathBinding = "ng-model=\"element.instance" + path.join('') + "\"";
            if (fragments.length > 0) {
                return template
                    .replace("data-jsonforms-model", pathBinding)
                    .replace("data-jsonforms-validation", "ng-change='element.validate()'");
            } else {
                return template;
            }
        };
        return {
            restrict: 'E',
            scope: {element: "="},
            replace: true,
            link: function(scope, element) {
                var fragments = scope.element.path !== undefined ? scope.element.path.split('/') : [];
                if (scope.element.templateUrl) {
                    $templateRequest(scope.element.templateUrl).then(function(template) {
                        var updatedTemplate = replaceJSONFormsAttributeInTemplate(template, fragments);
                        var compiledTemplate = $compile(updatedTemplate)(scope);
                        element.replaceWith(compiledTemplate);
                    })
                } else {
                    var updatedTemplate = replaceJSONFormsAttributeInTemplate(scope.element.template, fragments);
                    var template = $compile(updatedTemplate)(scope);
                    element.replaceWith(template);
                }
            }
        }
    }]).directive('control', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'templates/control.html'
    }
}).directive('layout', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'templates/layout.html'
    }
}).directive('widget', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: `<div class="col-sm-{{element.size}} jsf-label ng-transclude"></div>`
    }
})

;
