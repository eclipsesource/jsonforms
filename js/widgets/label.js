
var app = angular.module('jsonForms.label', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register({
        id: "Label",
        render: function (element) {

            var uiElement = RenderService.createUiElement("", "", {type:"Label"}, element.text);

            return {
                "type": element.type,
                "elements": [uiElement],
                "size": maxSize
            };
        }
    });
}]);