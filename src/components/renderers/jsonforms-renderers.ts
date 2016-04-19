
import {IPathResolver} from "../services/pathresolver/jsonforms-pathresolver";
import {ISchemaProvider} from "../services/services";
import {ServiceId} from "../services/services";
import {PathUtil} from "../services/pathutil";
import {Services} from "../services/services";
import {IScopeProvider} from "../services/services";
import {IValidationService} from "../services/services";
import {IPathResolverService} from "../services/services";
import {IDataProvider} from "../services/data/data-service";
import {IRuleService} from "../services/rule/rule-service";

let JsonRefs = require("json-refs/index.js");

export class RenderService implements IRenderService {

    private renderers: IRenderer[] = [];
    static $inject = ['PathResolver'];

    constructor(private refResolver: IPathResolver) {
    }

    render(scope: ng.IScope, element: IUISchemaElement, services: Services) {

        var foundRenderer;
        var indexedSchemaPath;
        var schemaPath;
        var subSchema;
        var schema;

        //TODO: FIXME
        JsonRefs.resolveRefs(services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema(), {},
            (err, resolvedSchema) => {
                schema =  resolvedSchema;
            });

        // TODO element must be IControl
        // TODO use isControl
        if (element['scope']) {
            indexedSchemaPath = element['scope']['$ref'];
            schemaPath = PathUtil.filterIndexes(indexedSchemaPath);
            subSchema = this.refResolver.resolveSchema(schema, schemaPath);
        }

        for (var i = 0; i < this.renderers.length; i++) {
            if (this.renderers[i].isApplicable(element, subSchema, schemaPath)) {
                if (foundRenderer == undefined || this.renderers[i].priority > foundRenderer.priority) {
                    foundRenderer = this.renderers[i];
                }
            }
        }

        if (foundRenderer === undefined) {
            throw new Error("No applicable renderer found for element " + JSON.stringify(element));
        }

        var rendered= foundRenderer.render(element, schema, indexedSchemaPath, services);
        services.get<IScopeProvider>(ServiceId.ScopeProvider).getScope().$broadcast('modelChanged');
        return rendered;
    }

    register = (renderer:IRenderer) => {
        this.renderers.push(renderer);
    }
}

export class RenderDescriptionFactory implements IRendererDescriptionFactory {
    // TODO: schemapath might be obsolete, re-check
    static createControlDescription(schemaPath:string, services: Services, element: IControlObject):IRenderDescription {
        return new ControlRenderDescription(schemaPath, services, element);
    }

    /**
     * This is a helper method typically used by layouts that render their contained children in a horizontal
     * fashion. In contrast to {@link renderElements} this function also takes into account whether labels
     * of controls should be rendered at all, which might be the case if the UI schema declaration states that
     * the label for each control is not to be shown.
     *
     * @param elements the UI schema children elements to be rendered
     * @param renderService the RenderService that is used to render the UI schema elements
     * @param services the service registry
     * @returns {*[]} an array of RenderDescription objects that describe the UI schema elements to be rendered
     */
    static renderElementsHorizontally(elements:IUISchemaElement[], renderService:  IRenderService, services: Services):IRenderDescription[] {

        let labelExists = elements.reduce((atLeastOneLabel, element) => {
            return atLeastOneLabel ||  LabelObjectUtil.shouldShowLabel(element.label);
        }, false);

        return elements.map(element => {
            let renderDesc = renderService.render(
                services.get<IScopeProvider>(ServiceId.ScopeProvider).getScope(),
                element,
                services);
            renderDesc.showLabel = labelExists;
            return renderDesc;
        });
    }

    /**
     * This is a helper method typically used by layouts to render their contained children.
     *
     * @param elements the UI schema children elements to be rendered
     * @param renderService the RenderService that is used to render the UI schema elements
     * @param services the service registry
     * @returns {*[]} an array of RenderDescription objects that describe the UI schema elements to be rendered
     */
    static renderElements(elements:IUISchemaElement[], renderService: IRenderService, services:Services):IRenderDescription[] {
        return elements.map(element => {
            return renderService.render(
                services.get<IScopeProvider>(ServiceId.ScopeProvider).getScope(),
                element,
                services);
        });
    }

    static createContainerDescription(size:number, elements:any, template:string, services: Services, element: IUISchemaElement){
        return new ContainerRenderDescription(size, elements, template, services, element);
    }
}

export class ContainerRenderDescription implements IContainerRenderDescription {
    type= "Layout";
    public instance: any;
    public size: number;
    public elements: IRenderDescription[];
    public template: string;
    public rule: IRule;
    public path: string;
    constructor(size:number, elements: IControlRenderDescription[], template: string, services: Services, element: IUISchemaElement){
        this.size = size;
        this.elements = elements;
        this.template = template;
        this.instance = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        this.rule = element.rule;
        this.path = PathUtil.normalize(element['scope'] ? element['scope']['$ref'] : "");
        services.get<IRuleService>(ServiceId.RuleService).addRuleTrack(this);
    }
}

export class ControlRenderDescription implements IControlRenderDescription {

    public type = "Control";
    public size = 100;
    public alerts: any[] = []; // TODO IAlert type missing
    public label: string;
    public showLabel: boolean;
    public rule: IRule;
    public readOnly: boolean;
    public path: string;
    public instance: any;
    private schema: SchemaElement;
    private validationService: IValidationService;
    private pathResolver: IPathResolver;
    private ruleService: IRuleService;
    private scope: ng.IScope;

    constructor(private schemaPath: string, services: Services, element: IControlObject) {
        this.instance = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        this.schema = services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
        this.validationService = services.get<IValidationService>(ServiceId.Validation);
        this.pathResolver = services.get<IPathResolverService>(ServiceId.PathResolver).getResolver();
        this.ruleService = services.get<IRuleService>(ServiceId.RuleService);
        this.scope = services.get<IScopeProvider>(ServiceId.ScopeProvider).getScope();

        this.path = PathUtil.normalize(schemaPath);
        this.label = this.createLabel(schemaPath, element.label);
        // by default labels are shown
        this.showLabel = LabelObjectUtil.shouldShowLabel(element.label);
        this.readOnly = element.readOnly;
        this.rule  = element.rule;
        this.ruleService.addRuleTrack(this);
        this.setupModelChangedCallback();
    }

    private createLabel(schemaPath:string, label: IWithLabel):string {

        let labelObject = LabelObjectUtil.getElementLabelObject(label, schemaPath);
        let stringBuilder = labelObject.text;

        if (this.isRequired(schemaPath)) {
            stringBuilder += "*";
        }

        return stringBuilder;
    }

    private displayLabel(labelAlignment:string):boolean {
        return labelAlignment === "NONE";
    }

    private isRequired(schemaPath: string): boolean {
        var path = PathUtil.inits(schemaPath);
        var lastFragment = PathUtil.lastFragment(path);

        // if last fragment points to properties, we need to move one level higher
        if (lastFragment === "properties") {
            path = PathUtil.inits(path);
        }

        // FIXME: we want resolveSchema to actually return an array here
        var subSchema: any = this.pathResolver.resolveSchema(this.schema, path + "/required");
        if (subSchema !== undefined) {
            if (subSchema.indexOf(PathUtil.lastFragment(schemaPath)) != -1) {
                return true;
            }
        }

        return false;
    }

    private setupModelChangedCallback():void {
        this.scope.$on('modelChanged', () => {
            // TODO: remote references to services
            // instead try to iterate over all services and call some sort of notifier
            this.validate();
            this.ruleService.reevaluateRules(this.schemaPath);
        })
    }

    modelChanged():void {
        this.scope.$broadcast('modelChanged');
        this.scope.$emit('modelChanged');
    }

    validate() {
        this.validationService.validate(this.instance, this.schema);
        var result = this.validationService.getResult(this.instance, '/' + this.path);
        this.alerts = [];
        if (result !== undefined) {
            var alert = {
                type: 'danger',
                msg: result
            };
            this.alerts.push(alert);
        }
    }

}

export class LabelObjectUtil {

    public static shouldShowLabel(label: IWithLabel): boolean {
        if (label === undefined ) {
            return true;
        } else if (typeof label === 'boolean') {
            return <boolean> label;
        } else if (typeof label === 'string') {
            return (<string> label) != "";
        } else {
            let labelObj = <ILabelObject> label;
            return labelObj.hasOwnProperty("show") ? labelObj.show : true;
        }
    }

    public static getElementLabelObject(labelProperty:IWithLabel, schemaPath:string):ILabelObject {
        if (typeof labelProperty === "boolean") {
            if (labelProperty) {
                return new LabelObject(PathUtil.beautifiedLastFragment(schemaPath), <boolean>labelProperty);
            } else {
                return new LabelObject(undefined, <boolean>labelProperty);
            }
        } else if (typeof labelProperty === "string") {
            return new LabelObject(<string>labelProperty, true);
        } else if (typeof labelProperty === "object") {
            var show = labelProperty.hasOwnProperty("show") ? (<ILabelObject>labelProperty).show : true;
            var label = labelProperty.hasOwnProperty("text") ? (<ILabelObject>labelProperty).text : PathUtil.beautifiedLastFragment(schemaPath);
            return new LabelObject(label, show);
        } else {
            return new LabelObject(PathUtil.beautifiedLastFragment(schemaPath), true);
        }
    }
}

export class LabelObject implements ILabelObject {
    public text:string;
    public show:boolean;

    constructor(text:string, show:boolean) {
        this.text = text;
        this.show = show;
    }
}


export interface IRenderService {
    register(renderer: IRenderer): void
    render(scope: ng.IScope, element: IUISchemaElement, services: Services);
}

export interface IRenderer {
    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: Services): IRenderDescription
    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean
    priority: number
}

export interface IRenderDescription {
    type: string
    size: number
    template?: string
    templateUrl?: string
    rule?: IRule;
    showLabel?: boolean
}

export interface IControlRenderDescription extends IRenderDescription {
    path: string

    alerts: any[]
    modelChanged(): void
}

export interface IRendererDescriptionFactory {

}

export interface IContainerRenderDescription extends IRenderDescription {
    elements: IRenderDescription[]
}


