///<reference path="../references.ts"/>

module JSONForms {

    var currentSchema: SchemaElement;

    export class RenderService implements IRenderService {

        private renderers: IRenderer[] = [];
        static $inject = ['PathResolver'];

        constructor(private refResolver: IPathResolver) {
        }

        render(element: IUISchemaElement, services: JSONForms.Services) {

            var foundRenderer;
            var schemaPath;
            var subSchema;
            var schema = services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();

            // TODO element must be IControl
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

            return foundRenderer.render(element, schema, schemaPath, services);
        }

        register = (renderer:IRenderer) => {
            this.renderers.push(renderer);
        }
    }

    export class RenderDescriptionFactory implements IRendererDescriptionFactory {
        static createControlDescription(schemaPath: string, services: JSONForms.Services, label?: string, rule?:IRule): IRenderDescription {
            return new ControlRenderDescription(schemaPath, services, label, rule);
        }
    }

    export class ControlRenderDescription implements IControlRenderDescription {

        type = "Control";
        size = 99;
        alerts: any[] = []; // TODO IAlert type missing
        public label: string;
        public path: string;

        public instance: any;
        schema: SchemaElement;
        private validationService: IValidationService;
        private ruleService: IRuleService;

        constructor(private schemaPath: string, private services: JSONForms.Services, label?: string, public rule?:IRule) {
            this.instance = services.get<JSONForms.IDataProvider>(ServiceId.DataProvider).getData();
            this.schema = services.get<JSONForms.ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
            this.validationService = services.get<JSONForms.IValidationService>(ServiceId.Validation);
            this.ruleService = services.get<JSONForms.IRuleService>(ServiceId.RuleService);
            this.path = PathUtil.normalize(schemaPath);
            var l;
            if (label) {
                l = label;
            } else {
                l = PathUtil.beautifiedLastFragment(schemaPath);
            }
            this.label = l;
            this.ruleService.addRuleTrack(this);
            this.ruleService.revaluateRules(this, this.schemaPath);
        }

        modelChanged():void {
            this.validationService.validate(this.instance, this.schema);
            var result = this.validationService.getResult(this.instance, '/' + this.path);
            if (result != undefined) {
                var alert = {
                    type: 'danger',
                    msg: result['message']
                };
                this.alerts.push(alert);
            } else {
                this.alerts = [];
            }
            this.ruleService.revaluateRules(this, this.schemaPath);
        }
    }
}
