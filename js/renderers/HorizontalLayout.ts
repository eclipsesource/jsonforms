/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class HorizontalLayout implements jsonforms.services.IRenderer {

    constructor(private renderServ: jsonforms.services.IRenderService) {

    }

    priority = 1;

    render = (element:jsonforms.services.UISchemaElement, schema, instance, path:String, dataProvider) => {

        var that = this;

        var renderElements = function (elements) {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                var basePath = path + "/elements/";
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderServ.render(curr, schema, instance, basePath + idx, dataProvider));
                    return acc;
                }, []);
            }
        };
        // TODO
        var maxSize = 99;

        var renderedElements = renderElements(element.elements);
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

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element.type == "HorizontalLayout";
    }

}

var app = angular.module('jsonForms.horizontalLayout', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new HorizontalLayout(RenderService));
}]);

