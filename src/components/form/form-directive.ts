import 'angular';
let JsonRefs = require('json-refs');

import {UiSchemaRegistry} from '../ng-services/uischemaregistry/uischemaregistry-service';
import {ISchemaGenerator} from '../generators/generators';
import {PathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {IUiSchemaProvider} from '../services/services';
import {ValidationService} from '../services/services';
import {ISchemaProvider, SchemaProvider} from '../services/services';
import {ScopeProvider} from '../services/services';
import {Services, ServiceId} from '../services/services';
import {IDataProvider} from '../services/data/data-service';
import {RuleService} from '../services/rule/rule-service';
import {DefaultDataProvider} from '../services/data/data-services';
import {RendererService} from '../renderers/renderer-service';
import {IUISchemaElement} from '../../uischema';
import {SchemaElement} from '../../jsonschema';

export class FormController {

    static $inject = ['RendererService', 'UiSchemaRegistry',
        'SchemaGenerator', '$compile', '$q', '$scope'];
    public element: any;
    public uiSchema: IUISchemaElement;
    private isInitialized = false;
    private childScope: ng.IScope;

    private static isDataProvider(testMe: any): testMe is IDataProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    }

    private static isUiSchemaProvider(testMe: any): testMe is IUiSchemaProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchUiSchema');
    }

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

        let resolvedSchemaDeferred = this.$q.defer();
        let resolvedUISchemaDeferred = this.$q.defer();

        this.$q.all([this.fetchSchema(), this.fetchUiSchema()]).then((values) => {
            let schema = values[0];
            this.uiSchema = <IUISchemaElement>values[1];
            resolvedSchemaDeferred.resolve(schema);
            resolvedUISchemaDeferred.resolve(this.uiSchema);
        });


        this.$q.all([
            resolvedSchemaDeferred.promise,
            resolvedUISchemaDeferred.promise,
            this.fetchData()]
        ).then(values => {

            let schema = values[0];
            this.uiSchema = <IUISchemaElement> values[1];
            let data = values[2];

            if (this.uiSchema === undefined) {
                // resolve JSON schema, then generate ui Schema
                this.uiSchema = this.UISchemaRegistry.getBestUiSchema(schema, data);
            }

            let unresolvedRefs = JsonRefs.findRefs(schema);
            if (_.size(unresolvedRefs) === 0) {
                this.render(schema, data);
            } else {
                JsonRefs.resolveRefs(schema).then(
                    res => {
                        this.render(res.resolved, data);
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
    private render(schema: SchemaElement, data: any) {
        let dataProvider: IDataProvider;
        let services = new Services();
        services.add(new ScopeProvider(this.scope));
        services.add(new SchemaProvider(schema));
        services.add(new ValidationService());
        services.add(new RuleService());

        if (FormController.isDataProvider(this.scope.data)) {
            dataProvider = this.scope.data;
        } else {
            dataProvider = new DefaultDataProvider(this.$q, data);
        }

        services.add(dataProvider);

        this.childScope = this.scope.$new();
        this.childScope['services'] = services;
        this.childScope['uischema'] = this.uiSchema;
        let template = this.rendererService.getBestComponent(
            this.uiSchema, schema, dataProvider.getData());
        let compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('modelChanged');
    }

    private fetchSchema() {
        if (typeof this.scope.schema === 'object') {
            return this.$q.when(this.scope.schema);
        } else if (this.scope.schema !== undefined) {
            return this.scope.schema();
        } else {
            return this.$q.when(this.SchemaGenerator.generateDefaultSchema(this.scope.data));
        }
    }

    private fetchUiSchema() {

        if (FormController.isUiSchemaProvider(this.scope.uischema)) {
            return this.scope.uischema.getUiSchema();
        } else if (typeof this.scope.uischema === 'object') {
            return this.$q.when(this.scope.uischema);
        }

        // if we return undefined the caller will generate a default UI schema
        return this.$q.when(undefined);
    }

    private fetchData() {
        if (FormController.isDataProvider(this.scope.data)) {
            return this.scope.data.fetchData();
        } else if (typeof this.scope.data === 'object') {
            return this.$q.when(this.scope.data);
        }

        throw new Error(`The 'data' attribute must be specified.`);
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
    ) { }
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
