///<reference path="../../../references.ts"/>

import {IRenderer} from "../../jsonforms-renderers";
import {IRenderDescription} from "../../jsonforms-renderers";
import {Services} from "../../../services/services";
import {IPathResolver} from "../../../services/pathresolver/jsonforms-pathresolver";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";

class EnumRenderer implements IRenderer {

    priority = 3;

    constructor(private pathResolver: IPathResolver) {}

    render(element: IControlObject, schema: SchemaElement, schemaPath: string, services: Services): IRenderDescription {
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
        var enums =  subSchema.enum;
        var control = RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-control>
          <select  ng-options="option as option for option in element.options" id="${schemaPath}" class="form-control jsf-control jsf-control-enum" ${element.readOnly ? 'disabled' : ''} data-jsonforms-model data-jsonforms-validation></select>
        </jsonforms-control>`;
        control['options'] = enums;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.hasOwnProperty('enum');
    }
}

angular.module('jsonforms.renderers.controls.enum').run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new EnumRenderer(PathResolver));
}]);
