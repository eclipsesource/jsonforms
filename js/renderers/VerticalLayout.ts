/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class VerticalLayout implements jsonforms.services.IRenderer {

    constructor(private renderService: jsonforms.services.IRenderService) { }

    priority = 1;

    render(element:jsonforms.services.UISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IContainerResult{

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
                    <recelement ng-repeat="child in element.elements"
                                element="child"
                                bindings="bindings"
                                top-open-date="topOpenDate"
                                top-validate-number="topValidateNumber"
                                top-validate-integer="topValidateInteger">
                    </recelement>
                </fieldset>`
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout";
    }
}

var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);

app.run(['RenderService', function(RenderService) {
     RenderService.register(new VerticalLayout(RenderService));
}]);