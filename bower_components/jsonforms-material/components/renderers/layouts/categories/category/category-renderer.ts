///<reference path="../../../../references.ts"/>

class MaterialCategoryRenderer implements JSONForms.IRenderer {

    priority = 10;

    constructor(private renderService: JSONForms.IRenderService){ }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription{

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var label = element.label;
        var template = `
        <!--
            <md-tab label="{{element.label}}">
                <jsonforms-material-layout>
                    <fieldset>
                        <md-content layout-padding layout="column">
                            <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
                        </md-content>
                    </fieldset>
                </jsonforms-material-layout>
            </md-tab>
        -->
        `;

        var result:JSONForms.IContainerRenderDescription= JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
        result['label']=label;
        return result;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Category";
    }
}

angular.module('jsonforms-material.renderers.layouts.categories.category').run(['RenderService', function(RenderService) {
    RenderService.register(new MaterialCategoryRenderer(RenderService));
}]);
