///<reference path="../../../references.ts"/>

import {RenderDescriptionFactory} from "../../jsonforms-renderers";
import {IRenderer} from "../../jsonforms-renderers";
import {Services} from "../../../services/services";
import {IRenderDescription} from "../../jsonforms-renderers";

class StringRenderer implements IRenderer {

    priority = 2;

    static inject = ['RenderDescriptionFactory'];

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: Services): IRenderDescription {
        let control = RenderDescriptionFactory.createControlDescription(schemaPath, services, element);

        if (element['options'] != null && element['options']['multi']) {
            control.template = `<jsonforms-control>
               <textarea id="${schemaPath}" class="form-control jsf-control-string" ${element.readOnly ? 'readonly' : ''} data-jsonforms-model data-jsonforms-validation/>
            </jsonforms-control>`
        } else {
            control.template = `<jsonforms-control>
               <input type="text" id="${schemaPath}" class="form-control jsf-control-string" ${element.readOnly ? 'readonly' : ''} data-jsonforms-model data-jsonforms-validation/>
            </jsonforms-control>`;
        }

        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'string';
    }
}

export default angular
    .module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls'])
    .run(['RenderService', RenderService => {
        console.log("String renderer registered");
        RenderService.register(new StringRenderer())
    }]).name;
