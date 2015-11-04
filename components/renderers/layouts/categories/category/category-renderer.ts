///<reference path="../../../../references.ts"/>

class CategoryRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce((acc, curr, idx, els) => {
                    acc.push(this.renderService.render(curr, services));
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

angular.module('jsonforms.renderers.layouts.categories.category').run(['RenderService', function(RenderService) {
    RenderService.register(new CategoryRenderer(RenderService));
}]);
