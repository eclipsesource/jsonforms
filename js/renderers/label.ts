/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class Label implements jsonforms.services.IRenderer {

    priority = 1;

    render(element:jsonforms.services.UISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IResult {
        var text = element['text'];
        var size = 99;

        return {
            "type": "Widget",
            "size": size,
            "template": ` <div class="qb-label">{{text}}</div>`
        };
    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element.type == "Label";
    }

}

var app = angular.module('jsonForms.label', ['jsonForms.services']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new Label());
}]);