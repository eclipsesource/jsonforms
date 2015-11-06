///<reference path="../../../references.ts"/>

class VerticalRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

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

        var renderedElements = renderElements(element.elements);
        var label = element.label ? element.label : "";
        var template = element.type == "Group" ?
            `<layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <dynamic-widget ng-repeat="child in element.elements" element="child">
                </dynamic-widget>
               </fieldset>
             </layout>` :
            `<layout>
              <fieldset>
                <dynamic-widget ng-repeat="child in element.elements" element="child">
                </dynamic-widget>
             </fieldset>
            </layout>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99,renderedElements,template,services,element.rule);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout" || uiElement.type == "Group";
}
}

angular.module('jsonforms.renderers.layouts.vertical').run(['RenderService', function(RenderService) {
    RenderService.register(new VerticalRenderer(RenderService));
}]);
