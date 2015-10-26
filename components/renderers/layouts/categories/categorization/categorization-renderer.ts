///<reference path="../../../../references.ts"/>

class CategorizationRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IContainerRenderDescription{

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce((acc, curr, idx, els) => {
                    acc.push(this.renderService.render(curr, dataProvider));
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

angular.module('jsonforms.renderers.layouts.categories.categorization').run(['RenderService', function(RenderService) {
    RenderService.register(new CategorizationRenderer(RenderService));
}]);
