
import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";

class NumberRenderer implements IRenderer {

    priority = 2;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: Services) {
        var control = RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-control>
          <input type="number" step="0.01" id="${schemaPath}" class="form-control jsf-control-number" ${element.readOnly ? 'readonly' : ''} data-jsonforms-validation data-jsonforms-model/>
        </jsonforms-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'number';
    }
}

export default angular
    .module('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls'])
    .run(['RenderService', (RenderService) =>
        RenderService.register(new NumberRenderer())
    ]).name;
