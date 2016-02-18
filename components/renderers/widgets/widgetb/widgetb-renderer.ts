///<reference path="../../../references.ts"/>

class WidgetBRenderer implements JSONForms.IRenderer {

    private maxSize = 99;
    priority = 99;

    constructor(private renderService: JSONForms.IRenderService, private pathResolver: JSONForms.IPathResolver) { }

    render(element: IControlObject, subSchema: SchemaArray, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();

        if (!Array.isArray(data)) {
            data = this.pathResolver.resolveInstance(data, schemaPath);
        }

        var dataString = JSON.stringify(data);

        var auxUISchemaElements = [];
        var subSchema = this.pathResolver.resolveSchema(subSchema, schemaPath) as SchemaArray;
        var items = subSchema.items;
        var i = 0;
        for (var d in data) {
            var auxUISchemaElement = {
                "type": "Group",
                "elements": []
            };
            for (var prop in items['properties']) {
                if (items['properties'].hasOwnProperty(prop)) {
                    auxUISchemaElement.elements.push({
                        "type": "Control",
                        "label": JSONForms.PathUtil.beautify(prop),
                        "scope": {
                            "$ref": schemaPath + "/items/" + i + "/properties/" + prop
                        }
                    });
                }
            }
            auxUISchemaElements.push(auxUISchemaElement);
            i++;
        }

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(auxUISchemaElements, this.renderService, services);
        var label = element.label ? element.label : "";
        var template = `<jsonforms-layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child">
                </jsonforms-dynamic-widget>
               </fieldset>
             </jsonforms-layout>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema !== undefined && subSchema.type == 'array';
    }

}

angular.module('jsonforms.renderers.widgets.widgetb').run(['RenderService', 'PathResolver', (RenderService, PathResolver) => {
    RenderService.register(new WidgetBRenderer(RenderService, PathResolver));
}]);
