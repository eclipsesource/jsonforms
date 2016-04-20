
import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";
import {IRenderDescription} from "../../jsonforms-renderers";

class IntegerRenderer implements IRenderer {

    priority = 2;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: Services): IRenderDescription {
        var control = RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-control>
          <input type="number" step="1" id="${schemaPath}" class="form-control jsf-control-integer" ${element.readOnly ? 'readonly' : ''} data-jsonforms-validation data-jsonforms-model/>
        </jsonforms-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
    }
}

export default angular
    .module('jsonforms.renderers.controls.integer', ['jsonforms.renderers.controls'])
    .run(['RenderService', (RenderService) =>
        RenderService.register(new IntegerRenderer())
    ])
    .name;
