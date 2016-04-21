
import {RenderDescriptionFactory} from "../../jsonforms-renderers";
import {IContainerRenderDescription} from "../../jsonforms-renderers";
import {IRenderService} from "../../jsonforms-renderers";
import {IRenderer} from "../../jsonforms-renderers";
import {Services} from "../../../services/services";

import './group.css'

class GroupRenderer implements IRenderer {

    priority = 1;

    constructor(private renderService: IRenderService) { }

    render(element: ILayout, jsonSchema: SchemaElement, schemaPath: string, services: Services): IContainerRenderDescription {

        var renderedElements = RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
        var label = element.label ? element.label : "";
        var template = `<jsonforms-layout class="jsf-group">
              <fieldset>
                <legend ng-if="${label}">${label}</legend>
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child">
                </jsonforms-dynamic-widget>
               </fieldset>
             </jsonforms-layout>`;

        return RenderDescriptionFactory.createContainerDescription(100, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "Group";
    }
}

export default angular
    .module('jsonforms.renderers.layouts.group',  ['jsonforms.renderers.layouts'])
    .run(['RenderService', RenderService =>
        RenderService.register(new GroupRenderer(RenderService))
    ]).name;
