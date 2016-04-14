///<reference path="../../../../references.ts"/>

import {IContainerRenderDescription} from "../../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../../jsonforms-renderers";
import {IRenderService} from "../../../jsonforms-renderers";
import {IRenderer} from "../../../jsonforms-renderers";
import {Services} from "../../../../services/services";

class CategoryRenderer implements IRenderer {

    priority = 1;

    constructor(private renderService: IRenderService){ }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: Services): IContainerRenderDescription{

        var renderedElements = RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var label = element.label;
        var template = `<tab heading="${label}">
            <jsonforms-layout>
                <fieldset>
                    <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
                </fieldset>
            </jsonforms-layout>
        </tab>`;

        return RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "Category";
    }
}

export default angular
    .module('jsonforms.renderers.layouts.categories.category', ['jsonforms.renderers.layouts.categories'])
    .run(['RenderService', (RenderService) =>
        RenderService.register(new CategoryRenderer(RenderService))
    ]).name;
