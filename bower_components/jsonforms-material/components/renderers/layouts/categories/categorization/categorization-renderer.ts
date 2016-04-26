///<reference path="../../../../references.ts"/>

class MaterialCategorizationRenderer implements JSONForms.IRenderer {

    priority = 10;

    constructor(private renderService: JSONForms.IRenderService) {}

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {

        var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
        var template = `<jsonforms-material-layout>
            <md-tabs md-border-bottom md-dynamic-height md-autoselect>
            <!--
                <dynamic-widget ng-repeat="child in element.elements" element="child"></dynamic-widget>
            -->
                <md-tab ng-repeat="child in element.elements" label="{{child.label}}">
                    <jsonforms-material-layout>
                        <fieldset>
                            <md-content layout-padding layout="column">
                                <jsonforms-dynamic-widget ng-repeat="innerchild in child.elements" element="innerchild"></jsonforms-dynamic-widget>
                            </md-content>
                        </fieldset>
                    </jsonforms-material-layout>
                </md-tab>
            </md-tabs>
        </jsonforms-material-layout>`;

        return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Categorization";
    }
}

angular.module('jsonforms-material.renderers.layouts.categories.categorization').run(['RenderService', function(RenderService) {
    RenderService.register(new MaterialCategorizationRenderer(RenderService));
}]);
