///<reference path="..\..\typings\schemas\jsonschema.d.ts"/>
///<reference path="jsonforms-renderers.d.ts"/>
///<reference path="..\pathresolver\jsonforms-pathresolver.d.ts"/>
///<reference path="..\utils\pathutil.ts"/>
module JSONForms {

    declare var tv4;
    var currentSchema: SchemaElement;

    export class RenderService implements IRenderService {

        private renderers:IRenderer[] = [];
        static $inject = ['PathResolver'];

        constructor(private refResolver:IPathResolver) {
        }


        registerSchema(schema:SchemaElement) {
            currentSchema = schema;
        }

        render = (element:IUISchemaElement, dataProvider:JSONForms.IDataProvider) => {

            var foundRenderer;
            var schemaPath;
            var subSchema;

            // TODO element must be IControl
            if (element['scope']) {
                schemaPath = element['scope']['$ref'];
                subSchema = this.refResolver.resolveSchema(currentSchema, schemaPath);
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

            var resultObject = foundRenderer.render(element, currentSchema, schemaPath, dataProvider);
            if (resultObject.validate) {
                resultObject.validate();
            }
            return resultObject;
        };
        register = (renderer:IRenderer) => {
            this.renderers.push(renderer);
        }
    }

    export class RenderDescriptionFactoryService implements IRendererDescriptionFactory {
        createControlDescription(data: any, schemaPath: string, label?: string) {
            return new ControlRenderDescription(data, schemaPath, label);
        }
    }

    export class ControlRenderDescription implements IControlRenderDescription {

        type = "Control";
        size = 99;
        alerts: any[] = []; // TODO IAlert type missing
        public label: string;
        public path: string;

        constructor(public instance: any, private schemaPath: string, label?: string) {
            this.path = PathUtil.normalize(schemaPath);
            var l;
            if (label) {
                l = label;
            } else {
                l = PathUtil.beautifiedLastFragment(schemaPath);
            }
            this.label = l;
        }

        validate(): boolean {
            if (tv4 == undefined) {
                return true;
            }
            var normalizedPath = '/' + PathUtil.normalize(this.schemaPath);
            var results = tv4.validateMultiple(this.instance, currentSchema);
            var errorMsg = undefined;

            for (var i = 0; i < results['errors'].length; i++) {

                var validationResult = results['errors'][i];

                if (validationResult.schemaPath.indexOf('/required') != -1) {
                    var propName = validationResult['params']['key'];
                    if (propName == normalizedPath.substr(normalizedPath.lastIndexOf('/') + 1, normalizedPath.length)) {
                        errorMsg = "Missing property";
                        break;
                    }
                }

                if (validationResult['dataPath'] == normalizedPath) {
                    errorMsg = validationResult.message;
                    break;
                }
            }

            if (errorMsg == undefined) {
                // TODO: perform required check
                this.alerts = [];
                return true;
            }

            this.alerts = [];
            var alert = {
                type: 'danger',
                msg: errorMsg
            };
            this.alerts.push(alert);

            return false;
        }
    }
}
