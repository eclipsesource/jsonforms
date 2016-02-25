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

        this.$q.all([this.fetchSchema(), this.fetchUiSchema()]).then((values) => {
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
            return this.$q.when(this.scope.schema);
        } else if (this.scope.schema !== undefined) {
            return this.scope.schema();
        } else {
            return this.$q.when(this.SchemaGenerator.generateDefaultSchema(this.scope.data));
        }
    }

    private fetchUiSchema() {

        if (FormController.isUiSchemaProvider(this.scope.uiSchema)) {
            return this.scope.uiSchema.getUiSchema();
        } else if (typeof this.scope.uiSchema === "object") {
            return this.$q.when(this.scope.uiSchema);
        }

        // if we return undefined the caller will generate a default UI schema
        return this.$q.when(undefined);
    }

    private fetchData() {
        if (FormController.isDataProvider(this.scope.data)) {
            return this.scope.data.fetchData();
        } else if (typeof this.scope.data === "object") {
            return this.$q.when(this.scope.data);
        }

        throw new Error("The 'data' attribute must be specified.")
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
