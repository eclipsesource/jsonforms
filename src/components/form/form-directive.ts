import 'angular';
import {IUISchemaElement} from "../../uischema";
import {IUiSchemaProvider} from "../../../components/services/services";
import {UiSchemaProvider} from "../services/services";
let JsonRefs = require('json-refs');

import {UiSchemaRegistry} from '../ng-services/uischemaregistry/uischemaregistry-service';
import {ISchemaGenerator} from '../generators/generators';
import {PathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {ValidationService} from '../services/services';
import {ISchemaProvider, SchemaProvider} from '../services/services';
import {ScopeProvider} from '../services/services';
import {Services, ServiceId} from '../services/services';
import {IDataProvider} from '../services/data/data-service';
import {RuleService} from '../services/rule/rule-service';
import {DefaultDataProvider} from '../services/data/data-services';
import {RendererService} from '../renderers/renderer-service';
import {SchemaElement} from '../../jsonschema';

export class FormController {

    static $inject = ['RendererService', 'UiSchemaRegistry',
        'SchemaGenerator', '$compile', '$q', '$scope'];
    public element: any;
    private isInitialized = false;
    private childScope: ng.IScope;

    constructor(
        private rendererService: RendererService,
        private UISchemaRegistry: UiSchemaRegistry,
        private SchemaGenerator: ISchemaGenerator,
        private $compile: ng.ICompileService,
        private $q: ng.IQService,
        private scope: JsonFormsDirectiveScope
    ) { }

    public init() {
        if (this.isInitialized) {
            // remove previously rendered elements
            let children = angular.element(this.element.find('form')).children();
            children.remove();
            if (this.childScope !== undefined) {
                this.childScope.$destroy();
            }
        }

        this.isInitialized = true;

        let schema;
        let uiSchema;
        let data;

        this.fetchData(this.scope.data).then((d)=>{
            data = d;
            return this.fetchSchema(this.scope.schema, data);
        }).then((s)=>{
            schema = s;
            return this.fetchUiSchema(this.scope.uischema, data, schema);
        }).then((uis)=>{
            uiSchema = uis;
        }).then(()=>{
            let unresolvedRefs = JsonRefs.findRefs(schema);
            if (_.size(unresolvedRefs) === 0) {
                this.render(schema, uiSchema, data);
            } else {
                JsonRefs.resolveRefs(schema).then(
                    res => {
                        this.render(res.resolved, uiSchema, data);
                        // needed for remote cases
                        this.scope.$digest();
                    },
                    err => {
                        console.log(err.stack);
                    }
                );
            }
        });
    }
    private render(schema: SchemaElement, uiSchema: IUISchemaElement, data: any) {
        debugger;
        let services = new Services();

        services.add(new SchemaProvider(schema));
        services.add(new UiSchemaProvider(uiSchema));
        services.add(new DefaultDataProvider(this.$q, data));

        services.add(new ScopeProvider(this.scope));
        services.add(new ValidationService());
        services.add(new RuleService());

        this.childScope = this.scope.$new();
        this.childScope['services'] = services;
        this.childScope['uischema'] = uiSchema;
        let template = this.rendererService.getBestComponent(
            uiSchema, schema, data);

        let compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
    }

    private fetchSchema(schema, data) {
        debugger;
        if(schema === undefined){
            return this.$q.when(this.SchemaGenerator.generateDefaultSchema(data));
        }else if(typeof schema === 'function'){
            return this.$q.when(schema());
        }else {
            return this.$q.when(schema);
        }
    }

    private fetchUiSchema(uischema, data, schema) {
        debugger;
        if(uischema === undefined){
            return this.$q.when(this.UISchemaRegistry.getBestUiSchema(schema, data));
        }else if(typeof uischema === 'function'){
            return this.$q.when(uischema());
        }else {
            return this.$q.when(uischema);
        }

    }

    private fetchData(data) {
        debugger;
        if(data === undefined){
            throw new Error(`The 'data' attribute must be specified.`);
        }else if(typeof data === 'function'){
            return this.$q.when(data());
        }else {
            return this.$q.when(data);
        }
    }
}

export interface JsonFormsDirectiveScope extends ng.IScope {
    schema: any;
    uischema: any;
    data: any;
}

const formTemplate = `
<div>
    <form role='form' class='jsf-form rounded'></form>
</div>`;


export class JsonFormsDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'form.html';
    controller = FormController;
    controllerAs = 'vm';
    // we can't use bindToController because we want watchers
    scope = {
        schema: '=',
        uischema: '=',
        data: '='
    };
    link = (scope, el, attrs, ctrl) => {
        ctrl.element = el;
        scope.$watchGroup(['data', 'uischema'], (newValue) => {
            if (angular.isDefined(newValue)) {
                ctrl.init();
            }
        });
    }
}


export class InnerFormController {
    static $inject = ['RendererService', '$compile', '$scope'];
    public element: any;
    private uischema: IUISchemaElement;
    constructor(
        private rendererService: RendererService,
        private $compile: ng.ICompileService,
        private scope: JsonFormsInnerDirectiveScope
    ) {}
    init() {

        let services: Services = this.scope['services'];
        let data = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        let schema = services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();

        let template = this.rendererService.getBestComponent(this.uischema, schema, data);

        this.scope['uischema'] = this.uischema;

        let compiledTemplate = this.$compile(template)(this.scope);

        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
    }
}
export interface JsonFormsInnerDirectiveScope extends ng.IScope {
    uischema: any;
}


export class JsonFormsInnerDirective implements ng.IDirective {

    restrict = 'E';
    templateUrl = 'form.html';
    controller = InnerFormController;
    controllerAs = 'vm';
    bindToController = {
        uischema: '='
    };
    scope = true;
    link = (scope, el, attrs, ctrl) => {
        ctrl.element = el;
        ctrl.init();
    }
}

export default angular.module('jsonforms.form.directives', ['jsonforms.form'])
    .directive('jsonforms', () => new JsonFormsDirective())
    .directive('jsonformsInner', () => new JsonFormsInnerDirective())
    .run(['$templateCache', ($templateCache: ng.ITemplateCacheService) =>
        $templateCache.put('form.html', formTemplate)]
    )
    .name;
