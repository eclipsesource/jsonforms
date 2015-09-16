/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class VerticalLayout implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IContainerRenderDescription{

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
        var label = element.label ? element.label : "";
        var template = label ?
            `<fieldset>
                    <legend>${label}</legend>
                    <recelement ng-repeat="child in element.elements" element="child">
                    </recelement>
             </fieldset>` :
            `<fieldset>
                    <recelement ng-repeat="child in element.elements" element="child">
                    </recelement>
            </fieldset>`;

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout" || uiElement.type == "Group";
    }
}

var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);

app.run(['JSONForms.RenderService', function(RenderService) {
     RenderService.register(new VerticalLayout(RenderService));
}]);