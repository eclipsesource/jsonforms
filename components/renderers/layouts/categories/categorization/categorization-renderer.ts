///<reference path="../../../../references.ts"/>

class CategorizationRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) {}

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var template = `<layout>
            <tabset>
                <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
            </tabset>
        </layout>`;

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
