
var app = angular.module('jsonForms.verticalLayout', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register({
        id: "VerticalLayout",
        render: function (verticalLayoutElement, model, instance, $scope) {
            var renderElements = function (elements) {
                if (elements === undefined || elements.length == 0) {
                    return [];
                } else {
                    return elements.reduce(function (acc, curr, idx, els) {
                        acc.push(RenderService.render(curr, model, instance, $scope)); return acc;
                    }, []);
                }
            };

            var renderedElements = renderElements(verticalLayoutElement.elements);
            //console.log("Rendered elements are " + JSON.stringify(renderedElements));

            return {
                "type": "VerticalLayout",
                "elements": renderedElements,
                "size": maxSize
            };
        }
    });
}]);