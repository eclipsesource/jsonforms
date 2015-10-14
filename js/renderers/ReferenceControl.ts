/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class ReferenceControl implements JSONForms.IRenderer {

    priority: number = 2;

    constructor(private pathResolver: JSONForms.IPathResolver) {}

    render(element:IUISchemaElement, schema:SchemaElement, schemaPath:string, dataProvider:JSONForms.IDataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        var normalizedPath = this.pathResolver.toInstancePath(schemaPath);
        var linkText = element['title'] ? element['title'] : "Go to " + control.label;
        control['template'] = `<a href="${element['href']}/${dataProvider.data[normalizedPath]}">${linkText}</a>`;
        return control;
    }

    isApplicable(uiElement:IUISchemaElement, subSchema:SchemaElement, schemaPath:string):boolean {
        return uiElement.type == "ReferenceControl";
    }
}

var app = angular.module('jsonforms.referenceControl', []);

app.run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new ReferenceControl(PathResolver));
}]);