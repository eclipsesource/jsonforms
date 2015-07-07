/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class VerticalLayoutRenderer implements jsonforms.services.IRenderer {

    constructor(private renderService: jsonforms.services.IRenderService) { }

    priority = 1;

    render(element:jsonforms.services.UISchemaElement, schema, instance, path: string, dataProvider) {

        var that = this;

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                var basePath = path + "/elements/";
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderService.render(curr, schema, instance, basePath + idx, dataProvider));
                    return acc;
                }, []);
            }
        };

        var renderedElements = renderElements(element.elements);

        return {
            "type": "VerticalLayout",
            "elements": renderedElements,
            "size": 99
        };
    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element.type == "VerticalLayout";
    }
}

var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);

app.run(['RenderService', function(RenderService) {
     RenderService.register(new VerticalLayoutRenderer(RenderService));
}]);