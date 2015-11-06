///<reference path="../../../references.ts"/>

class GroupRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, jsonSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
        var label = element.label ? element.label : "";
        var template = `<layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <dynamic-widget ng-repeat="child in element.elements" element="child">
                </dynamic-widget>
               </fieldset>
             </layout>`;

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "Group";
    }
}

angular.module('jsonforms.renderers.layouts.group').run(['RenderService', (RenderService) => {
    RenderService.register(new GroupRenderer(RenderService));
}]);