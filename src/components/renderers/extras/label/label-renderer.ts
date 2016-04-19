
import {IRenderDescription} from "../../jsonforms-renderers";
import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";

class LabelRenderer implements IRenderer {

    priority = 1;

    render(element:IUISchemaElement, schema: SchemaElement, schemaPath: string, services: Services): IRenderDescription {
        var text = element['text'];
        var size = 100;

        return {
            "type": "Widget",
            "size": size,
            "template": ` <jsonforms-widget class="jsf-label">${text}<hr></jsonforms-widget>`
        };
    }

    isApplicable(element:IUISchemaElement):boolean {
        return element.type == "Label";
    }
}

export default angular
    .module('jsonforms.renderers.extras.label', ['jsonforms.renderers'])
    .run(['RenderService', RenderService =>
        RenderService.register(new LabelRenderer())
    ])
    .name;

