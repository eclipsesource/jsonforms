///<reference path="../../../../references.ts"/>

class SimpleArrayRenderer implements JSONForms.IRenderer {

    private maxSize = 99;
    priority = 98;

    constructor(private pathResolver: JSONForms.IPathResolver) { }

    render(element: IControlObject, subSchema: SchemaArray, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();

        if (!Array.isArray(data)) {
            data = this.pathResolver.resolveInstance(data, schemaPath);
        }

        var dataString = JSON.stringify(data);

        var properties = [];
        var subSchema = this.pathResolver.resolveSchema(subSchema, schemaPath) as SchemaArray;
        var items = subSchema.items;
        for (var prop in items['properties']) {
            if (items['properties'].hasOwnProperty(prop)) {
                properties.push(prop);
            }
        }

        var propertiesString = JSON.stringify(properties);

        var label = element.label ? element.label : "";

        var template = `<jsonforms-layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <div ng-repeat='d in ${dataString}'>
                    <div ng-repeat='prop in ${propertiesString}'><strong>{{prop.charAt(0).toUpperCase() + prop.substring(1)}}:</strong> {{d[prop]}}</div>
                    <hr ng-show="!$last">
                </div>
               </fieldset>
             </jsonforms-layout>`;

        return {
            "type": "Control",
            "size": this.maxSize,
            "template": template
        };
    }

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema !== undefined && subSchema.type == 'array';
    }

}

angular.module('jsonforms.renderers.controls.simplearray').run(['RenderService', 'PathResolver', (RenderService, PathResolver) => {
    RenderService.register(new SimpleArrayRenderer(PathResolver));
}]);
