///<reference path="../../../references.ts"/>

class HorizontalRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) {

    }

    priority = 1;

    render = (element: ILayout, subSchema: SchemaElement, schemaPath:String, services: JSONForms.Services): JSONForms.IContainerRenderDescription => {

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce((acc, curr, idx, els) => {
                    acc.push(this.renderService.render(
                        services.get<JSONForms.IScopeProvider>(JSONForms.ServiceId.ScopeProvider).getScope(),
                        curr,
                        services));
                    return acc;
                }, []);
            }
        };

        var maxSize = 99;

        var renderedElements = renderElements(element.elements);
        var size = renderedElements.length;
        var label = element.label ? element.label : "";
        var individualSize = Math.floor(maxSize / size);
        for (var j = 0; j < renderedElements.length; j++) {
            renderedElements[j].size = individualSize;
        }

        var template = label ?
                `<layout><fieldset>
                   <legend>${label}</legend>
                   <div class="row">
                     <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
                   </div>
                 </fieldset></layout>` :
                `<layout><fieldset>
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

angular.module('jsonforms.renderers.layouts.horizontal').run(['RenderService', function(RenderService) {
    RenderService.register(new HorizontalRenderer(RenderService));
}]);
