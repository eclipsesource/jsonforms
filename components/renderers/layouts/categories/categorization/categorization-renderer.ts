///<reference path="../../../../references.ts"/>

class CategorizationRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) {}

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var template = `<jsonforms-layout>
            <tabset>
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
            </tabset>
        </jsonforms-layout>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99,renderedElements,template,services,element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Categorization";
    }
}

angular.module('jsonforms.renderers.layouts.categories.categorization').run(['RenderService', (RenderService) => {
    RenderService.register(new CategorizationRenderer(RenderService));
}]);
