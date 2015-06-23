
var app = angular.module('jsonForms.label', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register({
        id: "Label",
        render: function (uiElement, schema, instance, path) {

            if (schema.hasOwnProperty("path")) {
                uiElement.schemaType = schema["path"]["type"];
                console.log("element is " + JSON.stringify(uiElement));
            }

            var uiElement = RenderService.createUiElement("", "Label", "Label", uiElement.schemaType, uiElement.text);

            return {
                "type": "Label",
                "elements": [uiElement],
                "size": maxSize
            };
        }
    });
}]);