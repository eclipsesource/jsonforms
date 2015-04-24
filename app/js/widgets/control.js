
var app = angular.module('jsonForms.control', []);

app.run(['RenderService', 'BindingService', 'DataCommon', function(RenderService, BindingService, DataCommon) {



    RenderService.register({
        id: "Control",
        render: function (element, model, instance) {

            var elementName = element.feature.name;
            if (elementName === undefined || elementName === null) {
                elementName = element.feature.path;
            }

            var elementTypeInfo = DataCommon.getType(element.feature.path, model);
            var instanceValue = DataCommon.getValue(element.feature.path, instance);

            var uiElement = RenderService.createUiElement(elementName, element.feature.path, elementTypeInfo, instanceValue);
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