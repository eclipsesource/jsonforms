///<reference path="../../../references.ts"/>

class GroupRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, jsonSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
        var label = element.label ? element.label : "";
        var template = `<jsonforms-layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child">
                </jsonforms-dynamic-widget>
               </fieldset>
             </jsonforms-layout>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "Group";
    }
}

angular.module('jsonforms.renderers.layouts.group').run(['RenderService', (RenderService) => {
    RenderService.register(new GroupRenderer(RenderService));
}]);
