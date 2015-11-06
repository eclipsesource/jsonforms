///<reference path="../../../references.ts"/>

class HorizontalRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) {
    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: ILayout, subSchema: SchemaElement, schemaPath:String, services: JSONForms.Services): JSONForms.IContainerRenderDescription {
                    acc.push(this.renderService.render(
                        services.get<JSONForms.IScopeProvider>(JSONForms.ServiceId.ScopeProvider).getScope(),
                        curr,
                        services));

        var maxSize = 99;

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var size = renderedElements.length;
        var individualSize = Math.floor(maxSize / size);
        for (var j = 0; j < renderedElements.length; j++) {
            renderedElements[j].size = individualSize;
        }

        var template =`<layout><fieldset>
                   <div class="row">
                     <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
                   </div>
                 </fieldset></layout>`;

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": maxSize,
            "template": template
        };
    };

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == "HorizontalLayout";
    }

}

angular.module('jsonforms.renderers.layouts.horizontal').run(['RenderService', (RenderService) => {
    RenderService.register(new HorizontalRenderer(RenderService));
}]);
