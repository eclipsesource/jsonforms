///<reference path="../../../references.ts"/>

import * as angular from 'angular';

import {Services} from "../../../services/services";
import {IRenderService} from "../../jsonforms-renderers";
import {IRenderer} from "../../jsonforms-renderers";
import {IContainerRenderDescription} from "../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";

class VerticalRenderer implements IRenderer {

    priority = 1;

    constructor(private renderService: IRenderService) { }

    render(element: ILayout, subSchema: SchemaElement, schemaPath: string, services: Services): IContainerRenderDescription {
        var renderedElements = RenderDescriptionFactory.renderElements(
            element.elements, this.renderService, services);
        var template = `<div ng-show='element.elements.length'>
          <jsonforms-layout class="jsf-vertical-layout">
                <jsonforms-dynamic-widget ng-repeat="child in element.elements" element="child">
                </jsonforms-dynamic-widget>
          </jsonforms-layout>
        </div>`;

        return RenderDescriptionFactory.createContainerDescription(100, renderedElements, template, services, element);
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath) :boolean {
        return uiElement.type == "VerticalLayout";
    }
}

export default angular
    .module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts'])
    .run(['RenderService', RenderService =>
        RenderService.register(new VerticalRenderer(RenderService))
    ]).name;
