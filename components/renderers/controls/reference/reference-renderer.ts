///<reference path="../../../references.ts"/>

class ReferenceRenderer implements JSONForms.IRenderer {

    priority: number = 2;

    constructor(private pathResolver: JSONForms.IPathResolver) {}

    render(element:IControlObject, schema:SchemaElement, schemaPath:string, services: JSONForms.Services) {
        var control = new JSONForms.ControlRenderDescription(schemaPath, services, element);
        var normalizedPath = this.pathResolver.toInstancePath(schemaPath);
        var prefix = element.label ? element.label : "Go to ";
        var linkText = element['href']['label'] ? element['href']['label'] : control.label;
        var data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();
        control['template'] =  `<div>${prefix} <a href="#${element['href']['url']}/${data[normalizedPath]}">${linkText}</a></div>`;
        return control;
    }

    isApplicable(uiElement:IUISchemaElement, subSchema:SchemaElement, schemaPath:string):boolean {
        return uiElement.type == "ReferenceControl";
    }
}

angular.module('jsonforms.renderers.controls.reference').run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new ReferenceRenderer(PathResolver));
}]);
