
var app = angular.module('jsonForms.control', []);

app.run(['RenderService', 'BindingService', 'DataCommon', function(RenderService, BindingService, DataCommon) {

    RenderService.register({
        id: "Control",
        render: function (element) {

            var elementName = element.name;
            if (elementName === undefined || elementName === null) {
                elementName = element.scope.path;
            }

            var uiElement = RenderService.createUiElement(elementName, element.scope.path)
            // TODO: id == path should be more obvious
            BindingService.add(uiElement.id, uiElement.value);

            return {
                "type": "Control",
                "elements": [uiElement],
                "size": 99
            };
        }
    });
}]);