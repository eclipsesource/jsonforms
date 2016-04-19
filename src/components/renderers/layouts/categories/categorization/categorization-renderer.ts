
import {RenderDescriptionFactory} from "../../../jsonforms-renderers";
import {IRenderer} from "../../../jsonforms-renderers";
import {IRenderService} from "../../../jsonforms-renderers";
import {Services} from "../../../../services/services";
import {IContainerRenderDescription} from "../../../jsonforms-renderers";

class CategorizationRenderer implements IRenderer {

    priority = 1;

    constructor(private renderService: IRenderService) {}

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: Services): IContainerRenderDescription {

        var renderedElements = RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var template = `<jsonforms-layout>
            <tabset>
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
            </tabset>
        </jsonforms-layout>`;

        return RenderDescriptionFactory.createContainerDescription(99,renderedElements,template,services,element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Categorization";
    }
}

export default angular
    .module('jsonforms.renderers.layouts.categories.categorization',  ['jsonforms.renderers.layouts.categories'])
    .run(['RenderService', (RenderService) =>
        RenderService.register(new CategorizationRenderer(RenderService))
    ])
    .name;
