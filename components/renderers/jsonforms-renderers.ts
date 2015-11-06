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
        static createControlDescription(schemaPath: string, services: JSONForms.Services, label?: string): IRenderDescription {
            return new ControlRenderDescription(schemaPath, services, label);
        }
    }

    export class ControlRenderDescription implements IControlRenderDescription {

        public type = "Control";
        public size = 99;
        public alerts: any[] = []; // TODO IAlert type missing
        public label: string;
        public path: string;
        public instance: any;

        private schema: SchemaElement;
        private validationService: IValidationService;
        private pathResolver: IPathResolver;
        private scope: ng.IScope;

        constructor(schemaPath: string, services: JSONForms.Services, label?: string) {
            this.instance = services.get<JSONForms.IDataProvider>(ServiceId.DataProvider).getData();
            this.schema = services.get<JSONForms.ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
            this.validationService = services.get<JSONForms.IValidationService>(ServiceId.Validation);
            this.pathResolver = services.get<JSONForms.IPathResolverService>(ServiceId.PathResolver).getResolver();
            this.scope = services.get<JSONForms.IScopeProvider>(ServiceId.ScopeProvider).getScope();

            this.path = PathUtil.normalize(schemaPath);
            this.label = this.createLabel(schemaPath, label);
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
                this.validate();
            })
        }

        modelChanged():void {
            this.scope.$broadcast('modelChanged');
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
