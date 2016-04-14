///<reference path="../../../references.ts"/>

import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";
import {IContainerRenderDescription} from "../../jsonforms-renderers";
import {IRenderService} from "../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";

class HorizontalRenderer implements IRenderer {

    priority = 1;

    constructor(private renderService: IRenderService) { }

    render(element: ILayout, subSchema: SchemaElement, schemaPath:String, services: Services): IContainerRenderDescription {

        var maxSize = 100;

        var renderedElements = RenderDescriptionFactory.renderElementsHorizontally(
            element.elements, this.renderService, services);
        var size = renderedElements.length;
        var individualSize = Math.floor(maxSize / size);
        for (var j = 0; j < renderedElements.length; j++) {
            renderedElements[j].size = individualSize;
        }

        var template =`<jsonforms-layout class="jsf-horizontal-layout">
          <fieldset>
            <div class="row">
              <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child"></jsonforms-dynamic-widget>
            </div>
          </fieldset></jsonforms-layout>`;

        return RenderDescriptionFactory.createContainerDescription(maxSize, renderedElements, template, services, element);
    };

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == "HorizontalLayout";
    }

}

export default angular
    .module('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts'])
    .run(['RenderService', RenderService =>
        RenderService.register(new HorizontalRenderer(RenderService))
    ]).name;
