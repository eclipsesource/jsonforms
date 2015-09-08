
var app = angular.module('jsonForms.horizontalLayout', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register({
        id: "HorizontalLayout",
        render: function (horizontalLayoutElement, model, instance, $scope) {
            var renderElements = function (elements) {
                if (elements === undefined || elements.length == 0) {
                    return [];
                } else {
                    return elements.reduce(function (acc, curr, idx, els) {
                        acc.push(RenderService.render(curr, model, instance, $scope)); return acc;
                    }, []);
                }
            };

            var renderedElements = renderElements(horizontalLayoutElement.elements);
            var size = renderedElements.length;
            var individualSize = Math.floor(maxSize / size);
            for (var j = 0; j < renderedElements.length; j++) {
                renderedElements[j].size = individualSize;
            }

            return {
                "type": "HorizontalLayout",
                "elements": renderedElements,
                "size": maxSize
            };
        }
    });
}]);