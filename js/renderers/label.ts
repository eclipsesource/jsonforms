/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class LabelRenderer implements jsonforms.services.IRenderer {

    priority = 1;

    render(element:jsonforms.services.UISchemaElement, schema, instance, path: string, dataProvider) {
        var label = {};
        label["text"] = element['text'];

        return {
            "type": "Label",
            "elements": [label],
            // TODO
            "size": 99
        };
    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element.type == "Label";
    }

}

var app = angular.module('jsonForms.label', ['jsonForms.services']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new LabelRenderer());
}]);