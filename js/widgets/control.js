
var app = angular.module('jsonForms.control', []);

app.run(['RenderService', 'BindingService', 'ReferenceResolver',
    function(RenderService, BindingService, ReferenceResolver) {

    RenderService.register({
        id: "Control",
        render: function (resolvedElement, schema, instance, path) {

            resolvedElement.id = resolvedElement.scope.$ref;

            var elementName = resolvedElement.name;
            if (elementName === undefined || elementName === null) {
                elementName = resolvedElement.path;
            }

            var value = ReferenceResolver.resolve(instance, path);
            var uiElement = RenderService.createUiElement(elementName, resolvedElement, value);

            BindingService.add(uiElement.id, uiElement.value);

            return {
                "type": "Control",
                "elements": [uiElement],
                "size": 99
            };
        }
    });
}]);