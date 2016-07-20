import { UiSchemaRegistry } from '../ng-services/uischemaregistry/uischemaregistry-service';
import { ISchemaGenerator } from '../generators/generators';
import { RendererService } from '../renderers/renderer-service';
import { IUISchemaElement } from '../../uischema';
export declare class FormController {
    private rendererService;
    private UISchemaRegistry;
    private SchemaGenerator;
    private $compile;
    private $q;
    private scope;
    static $inject: string[];
    element: any;
    uiSchema: IUISchemaElement;
    private isInitialized;
    private childScope;
    private static isDataProvider(testMe);
    private static isUiSchemaProvider(testMe);
    constructor(rendererService: RendererService, UISchemaRegistry: UiSchemaRegistry, SchemaGenerator: ISchemaGenerator, $compile: ng.ICompileService, $q: ng.IQService, scope: JsonFormsDirectiveScope);
    init(): void;
    private render(schema, data);
    private fetchSchema();
    private fetchUiSchema();
    private fetchData();
}
export interface JsonFormsDirectiveScope extends ng.IScope {
    schema: any;
    uischema: any;
    data: any;
}
export declare class JsonFormsDirective implements ng.IDirective {
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
