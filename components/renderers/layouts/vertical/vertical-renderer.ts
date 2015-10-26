///<reference path="../../../references.ts"/>

class VerticalRenderer implements JSONForms.IRenderer {

    constructor(private renderService: JSONForms.IRenderService) { }

    priority = 1;

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IContainerRenderDescription{

        var renderElements = (elements) => {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce((acc, curr, idx, els) => {
                    acc.push(this.renderService.render(curr, dataProvider));
                    return acc;
                }, []);
            }
        };

        var renderedElements = renderElements(element.elements);
        var label = element.label ? element.label : "";
        var template = label ?
            `<layout><fieldset>
                    <legend>${label}</legend>
                    <dynamic-widget ng-repeat="child in element.elements" element="child">
                    </dynamic-widget>
             </fieldset></layout>` :
            `<layout><fieldset>
                    <dynamic-widget ng-repeat="child in element.elements" element="child">
                    </dynamic-widget>
            </fieldset></layout>`;

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout" || uiElement.type == "Group";
    }
}

angular.module('jsonforms.renderers.layouts.vertical').run(['RenderService', function(RenderService) {
    RenderService.register(new VerticalRenderer(RenderService));
}]);