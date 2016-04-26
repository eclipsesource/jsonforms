///<reference path="../../../references.ts"/>

class MaterialHorizontalRenderer implements JSONForms.IRenderer {

    priority = 10;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, subSchema: SchemaElement, schemaPath:String, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var maxSize = 99;

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var size = renderedElements.length;
        var individualSize = Math.floor(maxSize / size);
        for (var j = 0; j < renderedElements.length; j++) {
            renderedElements[j].size = individualSize;
        }

        var template =`
        <jsonforms-material-layout>
            <fieldset>
                <div layout-padding layout="row" layout-sm="column">
                    <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
                </div>
            </fieldset>
        </jsonforms-material-layout>
        `;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(maxSize, renderedElements, template, services, element);
    };

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == "HorizontalLayout";
    }

}

angular.module('jsonforms-material.renderers.layouts.horizontal').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialHorizontalRenderer(RenderService));
}]);
