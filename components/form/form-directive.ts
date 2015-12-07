///<reference path="../references.ts"/>

import PathResolver = JSONForms.PathResolver;
declare var JsonRefs;

class FormController {

    static $inject = ['RenderService', 'PathResolver', 'UISchemaGenerator', 'SchemaGenerator', '$q', '$scope'];

    private isInitialized = false;
    public element: any;
    public elements: IUISchemaElement[];

    constructor(
        private RenderService: JSONForms.IRenderService,
        private PathResolver: JSONForms.IPathResolver,
        private UISchemaGenerator: JSONForms.IUISchemaGenerator,
        private SchemaGenerator: JSONForms.ISchemaGenerator,
        private $q: ng.IQService,
        private scope: JsonFormsDirectiveScope
    ) { }

    public init() {
        if (this.isInitialized) {
            // remove previously rendered elements
            var children = angular.element(this.element.find('form')).children();
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
                JsonRefs.resolveRefs(schema, {}, (err, resolvedSchema) => {
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
            services.add(new JSONForms.ScopeProvider(this.scope));
            services.add(new JSONForms.SchemaProvider(schema));
            services.add(new JSONForms.ValidationService());
            services.add(new JSONForms.RuleService(this.PathResolver));

            var dataProvider: JSONForms.IDataProvider;

            if (FormController.isDataProvider(this.scope.data)) {
                dataProvider = this.scope.data;
            } else {
                dataProvider = new JSONForms.DefaultDataProvider(this.$q, data);
            }

            services.add(dataProvider);

            this.elements = [this.RenderService.render(this.scope, uiSchema, services)];
        });
    }

    private fetchSchema() {
        if (typeof this.scope.schema === "object") {
            var p: ng.IDeferred<any> = this.$q.defer<any>();
            p.resolve(this.scope.schema);
            return p;
        } else if (this.scope.schema !== undefined) {
            return this.scope.schema();
        } else {
            var p: ng.IDeferred<any> = this.$q.defer<any>();
            p.resolve(this.SchemaGenerator.generateDefaultSchema(this.scope.data));
            return p;
        }
    }

    private fetchUiSchema() {

        if (FormController.isUiSchemaProvider(this.scope.uiSchema)) {
            return this.scope.uiSchema.getUiSchema();
        } else if (typeof this.scope.uiSchema === "object") {
            let p = this.$q.defer();
            p.resolve(this.scope.uiSchema);
            return p;
        }

        // if we return undefined the caller will generate a default UI schema
        let p: ng.IDeferred<any> = this.$q.defer<any>();
        p.resolve(undefined);
        return p;
    }

    private fetchData() {
        if (FormController.isDataProvider(this.scope.data)) {
            return this.scope.data.fetchData();
        } else if (typeof this.scope.data === "object") {
            var p = this.$q.defer();
            p.resolve(this.scope.data);
            return p.promise;
        }

        throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.")
    }

    private static isDataProvider(testMe: any): testMe is JSONForms.IDataProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    }

    private static isUiSchemaProvider(testMe: any): testMe is JSONForms.IUiSchemaProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchUiSchema');
    }
}

interface JsonFormsDirectiveScope extends ng.IScope {
    schema: any;
    uiSchema: any;
    data: any;
}


class JsonFormsDirective implements ng.IDirective {
    restrict = "E";
    replace = true;
    templateUrl = 'components/form/form.html';
    controller = FormController;
    controllerAs = 'vm';
    // we can't use bindToController because we want watchers
    scope = {
        schema: '=',
        uiSchema: '=',
        data: '=',
    };
    link = (scope, el, attrs, ctrl) => {
        ctrl.element = el;
        scope.$watchGroup(['data', 'uiSchema'], (newValue) => {
            if (angular.isDefined(newValue)){
                ctrl.init();
            }
        });
    }
}

angular.module('jsonforms.form').directive('jsonforms', () => new JsonFormsDirective());
