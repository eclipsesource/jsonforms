///<reference path="../../../references.ts"/>

class MaterialVerticalRenderer implements JSONForms.IRenderer {

    priority = 10;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {
        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var template = `
            <jsonforms-material-layout>
                <fieldset>
                    <div layout-padding layout="column">
                        <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
                    </div>
                </fieldset>
            </jsonforms-material-layout>
            `;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout";
    }
}

angular.module('jsonforms-material.renderers.layouts.vertical').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialVerticalRenderer(RenderService));
}]);
