
import {IRenderer} from "../../jsonforms-renderers";
import {PathResolver} from "../../../services/pathresolver/jsonforms-pathresolver";
import {Services} from "../../../services/services";
import {ControlRenderDescription} from "../../jsonforms-renderers";
import {ServiceId} from "../../../services/services";
import {IDataProvider} from "../../../services/data/data-service";

class ReferenceRenderer implements IRenderer {

    priority: number = 2;

    constructor(private pathResolver: PathResolver) {}

    render(element:IControlObject, schema:SchemaElement, schemaPath:string, services: Services) {
        var control = new ControlRenderDescription(schemaPath, services, element);
        var normalizedPath = this.pathResolver.toInstancePath(schemaPath);
        var prefix = element.label ? element.label : "Go to ";
        var linkText = element['href']['label'] ? element['href']['label'] : control.label;
        var data = services.get<IDataProvider>(ServiceId.DataProvider).getData();
        control['template'] =  `<div>${prefix} <a href="#${element['href']['url']}/${data[normalizedPath]}">${linkText}</a></div>`;
        return control;
    }

    isApplicable(uiElement:IUISchemaElement, subSchema:SchemaElement, schemaPath:string):boolean {
        return uiElement.type == "ReferenceControl";
    }
}

export default angular
    .module('jsonforms.renderers.controls.reference', ['jsonforms.renderers.controls'])
    .run(['RenderService', 'PathResolver', (RenderService, PathResolver) => {
        RenderService.register(new ReferenceRenderer(PathResolver))
    }])
    .name;
