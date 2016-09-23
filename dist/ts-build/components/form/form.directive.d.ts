import { UiSchemaRegistry } from '../ng-services/ui-schema-registry/ui-schema-registry.service';
import { ISchemaGenerator } from '../generators/generators';
import { RendererService } from '../renderers/renderer.service';
import { IUISchemaElement } from '../../uischema';
import { DataService } from '../ng-services/data/data.service';
export declare class FormController {
    private rendererService;
    private UISchemaRegistry;
    private dataService;
    private SchemaGenerator;
    private $compile;
    private $q;
    private scope;
    private timeout;
    static $inject: string[];
    element: any;
    uiSchema: IUISchemaElement;
    private isInitialized;
    private childScope;
    private static isDataProvider(testMe);
    constructor(rendererService: RendererService, UISchemaRegistry: UiSchemaRegistry, dataService: DataService, SchemaGenerator: ISchemaGenerator, $compile: ng.ICompileService, $q: ng.IQService, scope: JsonFormsDirectiveScope, timeout: ng.ITimeoutService);
    init(): void;
    private render(schema, data, uischema);
    private fetch(any);
    private isPromise(data);
}
export interface JsonFormsDirectiveScope extends ng.IScope {
    schema: any;
    uischema: any;
    data: any;
}
export declare class JsonFormsDirective implements ng.IDirective {
    private DataService;
    restrict: string;
    templateUrl: string;
    controller: typeof FormController;
    controllerAs: string;
    scope: {
        schema: string;
        uischema: string;
        data: string;
    };
    link: (scope: any, el: any, attrs: any, ctrl: any) => void;
    constructor(DataService: DataService);
}
export declare class InnerFormController {
    private rendererService;
    private $compile;
    private scope;
    static $inject: string[];
    element: any;
    private uischema;
    constructor(rendererService: RendererService, $compile: ng.ICompileService, scope: JsonFormsInnerDirectiveScope);
    init(): void;
}
export interface JsonFormsInnerDirectiveScope extends ng.IScope {
    uischema: any;
}
export declare class JsonFormsInnerDirective implements ng.IDirective {
    restrict: string;
    templateUrl: string;
    controller: typeof InnerFormController;
    controllerAs: string;
    bindToController: {
        uischema: string;
    };
    scope: boolean;
    link: (scope: any, el: any, attrs: any, ctrl: any) => void;
}
declare var _default: string;
export default _default;
