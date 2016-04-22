import 'angular'

import {IRenderService} from "../renderers/jsonforms-renderers";
import {IPathResolver} from "../services/pathresolver/jsonforms-pathresolver";
import {IUISchemaGenerator} from "../generators/generators";
import {ISchemaGenerator} from "../generators/generators";
import {PathResolver} from "../services/pathresolver/jsonforms-pathresolver";
import {IUiSchemaProvider} from "../services/services";
import {ValidationService} from "../services/services";
import {SchemaProvider} from "../services/services";
import {ScopeProvider} from "../services/services";
import {PathResolverService} from "../services/services";
import {Services,ServiceId} from "../services/services";
import {IDataProvider} from '../services/data/data-service';
import {RuleService} from "../services/rule/rule-service";
import {DefaultDataProvider} from "../services/data/data-services";
import {IRenderDescription} from '../renderers/jsonforms-renderers';
import {RendererService} from '../renderers/renderer-service';

class FormController {

    static $inject = ['RendererService','RenderService', 'PathResolver', 'UISchemaGenerator', 'SchemaGenerator','$compile', '$q', '$scope'];

    private isInitialized = false;
    public element: any;
    public elements: IRenderDescription[];
    public uiSchema: IUISchemaElement;
    private childScope:ng.IScope;

    constructor(
        private rendererService: RendererService,
        private RenderService: IRenderService,
        private PathResolver: IPathResolver,
        private UISchemaGenerator: IUISchemaGenerator,
        private SchemaGenerator: ISchemaGenerator,
        private $compile: ng.ICompileService,
        private $q: ng.IQService,
        private scope: JsonFormsDirectiveScope
    ) { }

    public init() {
        if (this.isInitialized) {
            // remove previously rendered elements
            var children = angular.element(this.element.find('form')).children();
            children.remove();
            if(this.childScope!=undefined)
                this.childScope.$destroy();
        }

        this.isInitialized = true;

        var resolvedSchemaDeferred = this.$q.defer();
        var resolvedUISchemaDeferred = this.$q.defer();

        this.$q.all([this.fetchSchema(), this.fetchUiSchema()]).then((values) => {
            var schema = values[0];
            this.uiSchema = <IUISchemaElement>values[1];

            if (this.uiSchema == undefined) {
                // resolve JSON schema, then generate ui Schema
                this.uiSchema = this.UISchemaGenerator.generateDefaultUISchema(schema);
            }

            resolvedSchemaDeferred.resolve(schema);
            resolvedUISchemaDeferred.resolve(this.uiSchema);
        });


        this.$q.all([resolvedSchemaDeferred.promise, resolvedUISchemaDeferred .promise, this.fetchData()]).then((values) => {
            var schema = values[0];
            this.uiSchema= <IUISchemaElement> values[1];
            var data = values[2];

            let dataProvider: IDataProvider;
            var services = new Services();

            services.add(new PathResolverService(new PathResolver()));
            services.add(new ScopeProvider(this.scope));
            services.add(new SchemaProvider(schema));
            services.add(new ValidationService());
            services.add(new RuleService(this.PathResolver));



            if (FormController.isDataProvider(this.scope.data)) {
                dataProvider = this.scope.data;
            } else {
                dataProvider = new DefaultDataProvider(this.$q, data);
            }

            services.add(dataProvider);

            this.childScope = this.scope.$new();
            this.childScope['services']=services;
            this.childScope['uiSchema']=this.uiSchema;
            //this.elements = [this.RenderService.render(this.scope, this.uiSchema, services)];
            let template=this.rendererService.getBestComponent(this.uiSchema,schema,dataProvider.getData());
            let compiledTemplate =this.$compile(template)(this.childScope);
            angular.element(this.element.find('form')).append(compiledTemplate);
            this.scope.$root.$broadcast('modelChanged');
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

    private static isDataProvider(testMe: any): testMe is IDataProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    }

    private static isUiSchemaProvider(testMe: any): testMe is IUiSchemaProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchUiSchema');
    }
}

interface JsonFormsDirectiveScope extends ng.IScope {
    schema: any;
    uiSchema: any;
    data: any;
}


export class JsonFormsDirective implements ng.IDirective {

    restrict = "E";
    replace = true;
    //templateUrl = formTemplate;
    template = require('./form.html');
    controller = FormController;
    controllerAs = 'vm';
    // we can't use bindToController because we want watchers
    scope = {
        schema: '=',
        uiSchema: '=',
        data: '='
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


class InnerFormController {
    static $inject = ['RendererService','$compile','$scope'];
    public element: any;
    private uiSchema:IUISchemaElement;
    constructor(
        private rendererService: RendererService,
        private $compile: ng.ICompileService,
        private scope: JsonFormsInnerDirectiveScope
    ) { }
    init(){
        let services:Services=this.scope['services'];
        let data = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        let template=this.rendererService.getBestComponent(this.uiSchema,this.scope['schema'],data);
        this.scope['uiSchema']=this.uiSchema;
        let compiledTemplate =this.$compile(template)(this.scope);

        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
    }
}
interface JsonFormsInnerDirectiveScope extends ng.IScope {
    uiSchema: any;
}


export class JsonFormsInnerDirective implements ng.IDirective {

    restrict = "E";
    replace = true;
    //templateUrl = formTemplate;
    template = require('./form.html');
    controller = InnerFormController;
    controllerAs = 'vm';
    // we can't use bindToController because we want watchers
    bindToController = {
        uiSchema: '='
    };
    scope=true;
    link = (scope, el, attrs, ctrl) => {
        ctrl.element = el;
        ctrl.init();
    }
}
