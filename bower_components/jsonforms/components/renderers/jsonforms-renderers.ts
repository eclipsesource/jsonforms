///<reference path="../references.ts"/>

module JSONForms {

    export class RenderService implements IRenderService {

        private renderers: IRenderer[] = [];
        static $inject = ['PathResolver'];

        constructor(private refResolver: IPathResolver) {
        }

        render(scope: ng.IScope, element: IUISchemaElement, services: JSONForms.Services) {

            var foundRenderer;
            var schemaPath;
            var subSchema;
            var schema = services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();

            // TODO element must be IControl
            // TODO use isControl
            if (element['scope']) {
                schemaPath = element['scope']['$ref'];
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

            var rendered= foundRenderer.render(element, schema, schemaPath, services);
            services.get<JSONForms.IScopeProvider>(ServiceId.ScopeProvider).getScope().$broadcast('modelChanged');
            return rendered;
        }

        register = (renderer:IRenderer) => {
            this.renderers.push(renderer);
        }
    }

    export class RenderDescriptionFactory implements IRendererDescriptionFactory {
        static createControlDescription(schemaPath:string, services:JSONForms.Services, element: IControlObject):IRenderDescription {
            return new ControlRenderDescription(schemaPath, services, element);
        }

        static renderElements(elements:IUISchemaElement[], renderService: JSONForms.IRenderService, services:JSONForms.Services):JSONForms.IRenderDescription[] {
            return elements.map((el) => {
                return renderService.render(
                    services.get<JSONForms.IScopeProvider>(ServiceId.ScopeProvider).getScope(),
                    el,
                    services);
            });
        }

        static createContainerDescription(size:number, elements:any, template:string, services: JSONForms.Services, element: IUISchemaElement){
            return new ContainerRenderDescription(size, elements, template, services, element);
        }
    }

    export class ContainerRenderDescription implements IContainerRenderDescription {
        type= "Layout";
        public instance: any;
        public size: number;
        public elements: IControlRenderDescription[];
        public template: string;
        public rule: IRule;
        constructor(size:number, elements: IControlRenderDescription[], template: string, services: JSONForms.Services, element: IUISchemaElement){
            this.size = size;
            this.elements = elements;
            this.template = template;
            this.instance = services.get<JSONForms.IDataProvider>(ServiceId.DataProvider).getData();
            this.rule = element.rule;
            services.get<JSONForms.IRuleService>(ServiceId.RuleService).addRuleTrack(this);
        }
    }

    export class ControlRenderDescription implements IControlRenderDescription {

        public type = "Control";
        public size = 99;
        public alerts: any[] = []; // TODO IAlert type missing
        public label: string;
        public rule: IRule;
        public readOnly: boolean;
        public path: string;
        public instance: any;

        private schema: SchemaElement;
        private validationService: IValidationService;
        private pathResolver: IPathResolver;
        private ruleService: IRuleService;
        private scope: ng.IScope;

        constructor(private schemaPath: string, services: JSONForms.Services, element: IControlObject) {
            this.instance = services.get<JSONForms.IDataProvider>(ServiceId.DataProvider).getData();
            this.schema = services.get<JSONForms.ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
            this.validationService = services.get<JSONForms.IValidationService>(ServiceId.Validation);
            this.pathResolver = services.get<JSONForms.IPathResolverService>(ServiceId.PathResolver).getResolver();
            this.ruleService = services.get<JSONForms.IRuleService>(ServiceId.RuleService);
            this.scope = services.get<JSONForms.IScopeProvider>(ServiceId.ScopeProvider).getScope();

            this.path = PathUtil.normalize(schemaPath);
            this.label = this.createLabel(schemaPath, element.label);
            this.readOnly = element.readOnly;
            this.rule  = element.rule;
            this.ruleService.addRuleTrack(this);
            this.setupModelChangedCallback();
        }

        private createLabel(schemaPath: string, label?: string): string {
            var stringBuilder = "";
            if (label) {
                stringBuilder += label;
            } else {
                // default label
                stringBuilder += PathUtil.beautifiedLastFragment(schemaPath);
            }

            if (this.isRequired(schemaPath)) {
                stringBuilder += "*";
            }

            return stringBuilder;
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
}
