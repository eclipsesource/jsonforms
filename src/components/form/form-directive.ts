import 'angular';
let JsonRefs = require('json-refs');

import {UiSchemaRegistry} from '../ng-services/uischemaregistry/uischemaregistry-service';
import {ISchemaGenerator} from '../generators/generators';
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
import {RootDataService} from '../ng-services/data/data-service';

export class FormController {

    static $inject = ['RendererService', 'UiSchemaRegistry', 'RootDataService',
        'SchemaGenerator', '$compile', '$q', '$scope'];
    public element: any;
    public uiSchema: IUISchemaElement;
    private isInitialized = false;
    private childScope: ng.IScope;

    private static isDataProvider(testMe: any): testMe is IDataProvider {
        return testMe !== undefined && testMe.hasOwnProperty('fetchData');
    }

    constructor(
        private rendererService: RendererService,
        private UISchemaRegistry: UiSchemaRegistry,
        private RootDataService: RootDataService,
        private SchemaGenerator: ISchemaGenerator,
        private $compile: ng.ICompileService,
        private $q: ng.IQService,
        private scope: JsonFormsDirectiveScope) { }


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

        this.$q.all([
            this.fetchData(this.scope.data),
            this.fetchSchema(this.scope.schema),
            this.fetchUiSchema(this.scope.uischema)])
            .then(values => {

                let data     = values[0];
                let schema   = values[1];
                let uischema = <IUISchemaElement>values[2];

                if (data === undefined) {
                    throw new Error(`The 'data' attribute must be specified.`);
                }
                this.RootDataService.setData(data);

                let s = schema === undefined ?
                    this.SchemaGenerator.generateDefaultSchema(data) :
                    schema;

                let u: IUISchemaElement = uischema === undefined ?
                    this.UISchemaRegistry.getBestUiSchema(s, data) :
                    uischema;

                let unresolvedRefs = JsonRefs.findRefs(s);
                if (_.size(unresolvedRefs) === 0) {
                    this.render(s, data, u);
                } else {
                    JsonRefs.resolveRefs(s).then(
                        res => {
                            this.render(res.resolved, data, u);
                            // needed for remote cases
                            this.scope.$digest();
                        },
                        err => console.error(err.stack)
                    );
                }
            });
    }
    private render(schema: SchemaElement, data: any, uischema: IUISchemaElement) {
        let dataProvider: IDataProvider;
        let services = new Services();

        services.add(new SchemaProvider(schema));
        services.add(new DefaultDataProvider(this.$q, data));
        services.add(new ScopeProvider(this.scope));
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
        this.childScope['uischema'] = uischema;
        let template = this.rendererService.getBestComponent(
            uischema, schema, dataProvider.getData());
        let compiledTemplate = this.$compile(template)(this.childScope);
        angular.element(this.element.find('form')).append(compiledTemplate);
        this.scope.$root.$broadcast('jsonforms:change');
    }

    private fetchSchema(schema) {
        if (typeof schema === 'function') {
            return this.$q.when(schema());
        } else {
            return this.$q.when(schema);
        }
    }

    private fetchUiSchema(uischema) {
        if (typeof uischema === 'function') {
            return this.$q.when(uischema());
        } else {
            return this.$q.when(uischema);
        }

    }

    private fetchData(data) {
        if (typeof data === 'function') {
            return this.$q.when(data());
        } else {
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
        let parent = el.parent();
        if (parent === undefined && parent.controller('jsonforms') === undefined) {
            // unset, if this is the root directive
            this.RootDataService.unset();
        }
        ctrl.element = el;
        scope.$watchGroup(['data', 'uischema'], (newValue) => {
            if (angular.isDefined(newValue)) {
                ctrl.init();
            }
        });
    };
    constructor(private RootDataService: RootDataService) { }
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
        this.scope.$root.$broadcast('jsonforms:change');
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
    .directive('jsonforms', ['RootDataService', (RootDataService) =>
        new JsonFormsDirective(RootDataService)]
    )
    .directive('jsonformsInner', () => new JsonFormsInnerDirective())
    .run(['$templateCache', ($templateCache: ng.ITemplateCacheService) =>
        $templateCache.put('form.html', formTemplate)]
    )
    .name;
