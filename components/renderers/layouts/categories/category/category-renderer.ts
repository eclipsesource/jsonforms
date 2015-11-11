///<reference path="../../../../references.ts"/>

class CategoryRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService){ }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var label = element.label;
        var template = `<tab heading="${label}">
            <layout>
                <fieldset>
                    <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
                </fieldset>
            </layout>
        </tab>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99,renderedElements,template,services,element.rule);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Category";
    }
}

angular.module('jsonforms.renderers.layouts.categories.category').run(['RenderService', function(RenderService) {
    RenderService.register(new CategoryRenderer(RenderService));
}]);
