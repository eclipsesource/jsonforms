///<reference path="../../../references.ts"/>

class MaterialGroupRenderer implements JSONForms.IRenderer {

    priority = 10;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, jsonSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
        var label = element.label ? element.label : "";
        var template = `
        <jsonforms-material-layout class="jsf-group">
            <fieldset>
                <legend>${label}</legend>
                <div layout-padding layout="column">
                    <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
                </div>
            </fieldset>
        </jsonforms-material-layout>
        `;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "Group";
    }
}

angular.module('jsonforms-material.renderers.layouts.group').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialGroupRenderer(RenderService));
}]);
