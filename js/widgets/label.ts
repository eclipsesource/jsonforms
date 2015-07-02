/// <reference path="../../typings/angularjs/angular.d.ts"/>

var app = angular.module('jsonForms.label', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register({
        id: "Label",
        render: function (uiElement, schema, instance, path, dataProvider) {

            var label = {};
            label["text"] = uiElement.text;

            return {
                "type": "Label",
                "elements": [label],
                // TODO
                "size": 99
            };
        }
    });
}]);