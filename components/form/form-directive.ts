///<reference path="../references.ts"/>

import PathResolver = JSONForms.PathResolver;
declare var JsonRefs;

class FormController {

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
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema) {
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

            var services = new JSONForms.Services();

            services.add(new JSONForms.PathResolverService(new PathResolver()));
            services.add(new JSONForms.ScopeProvider(this.$scope));
            services.add(new JSONForms.SchemaProvider(schema));
            services.add(new JSONForms.ValidationService());

            var dataProvider: JSONForms.IDataProvider;
            if (this.$scope.asyncDataProvider) {
                dataProvider = this.$scope.asyncDataProvider;
            } else {
                dataProvider = new JSONForms.DefaultDataProvider(this.$q, data);
            }
            services.add(dataProvider);

            this.$scope['elements'] = [this.RenderService.render(this.$scope, uiSchema, services)];
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

angular.module('jsonforms.form').directive('jsonforms', ():ng.IDirective => {
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
        templateUrl: 'components/form/form.html',
        controller: FormController,
        link: (scope, el, attrs, ctrl) => {
            scope['element'] = el;
            scope.$watch('uiSchema', () => { ctrl.init(); });
            scope.$watch('data', () => { ctrl.init(); });
        }
    }
});
