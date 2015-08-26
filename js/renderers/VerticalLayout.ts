/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class VerticalLayout implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element:JSONForms.UISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IContainerResult{

        var that = this;

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderService.render(curr, dataProvider));
                    return acc;
                }, []);
            }
        };

        var renderedElements = renderElements(element.elements);

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template":
                `<fieldset>
                    <recelement ng-repeat="child in element.elements" element="child">
                    </recelement>
                </fieldset>`
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout";
    }
}

var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);

app.run(['JSONForms.RenderService', function(RenderService) {
     RenderService.register(new VerticalLayout(RenderService));
}]);