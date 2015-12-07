///<reference path="../../../../references.ts"/>

class CategoryRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService){ }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var label = element.label;
        var template = `<tab heading="${label}">
            <jsonforms-layout>
                <fieldset>
                    <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
                </fieldset>
            </jsonforms-layout>
        </tab>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Category";
    }
}

angular.module('jsonforms.renderers.layouts.categories.category').run(['RenderService', (RenderService) => {
    RenderService.register(new CategoryRenderer(RenderService));
}]);
