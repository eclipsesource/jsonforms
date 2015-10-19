/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class Categorization implements JSONForms.IRenderer {

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
        var template =
        `<layout>
            <tabset>
                <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
            </tabset>
        </layout>
        `;

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Categorization";
    }
}

var app = angular.module('jsonforms.categorization', ['jsonforms.services']);

app.run(['RenderService', function(RenderService) {
     RenderService.register(new Categorization(RenderService));
}]);

class Category implements JSONForms.IRenderer {

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
        var label = element.label;
        var template =
        `
        <tab heading="${label}">
            <layout>
                <fieldset>
                    <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
                </fieldset>
            </layout>
        </tab>
        `;
        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Category";
    }
}

app.run(['RenderService', function(RenderService) {
     RenderService.register(new Category(RenderService));
}]);
