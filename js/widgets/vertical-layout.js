
var app = angular.module('jsonForms.verticalLayout', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register({
        id: "VerticalLayout",
        render: function (verticalLayoutElement, schema, instance, path) {
            var renderElements = function (elements) {
                if (elements === undefined || elements.length == 0) {
                    return [];
                } else {
                    var basePath = path + "/elements/";
                    return elements.reduce(function (acc, curr, idx, els) {
                        acc.push(RenderService.render(curr, schema, instance, basePath + idx));
                        return acc;
                    }, []);
                }
            };

            var renderedElements = renderElements(verticalLayoutElement.elements);

            return {
                "type": "VerticalLayout",
                "elements": renderedElements,
                "size": maxSize
            };
        }
    });
}]);