
import {RenderDescriptionFactory} from "../../jsonforms-renderers";
import {IRenderDescription} from "../../jsonforms-renderers";
import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";

class MasterDetailRenderer implements IRenderer {

    priority = 1;

    constructor() { }

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: Services): IRenderDescription {
        var control = RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `
        <div class="row">
            <!-- Master -->
            <div class="col-sm-30 jsf-masterdetail">
                <jsonforms-masterdetail-collection element="element" properties="element.schema.properties" instance="element.instance"></jsonforms-masterdetail-collection>
            </div>
            <!-- Detail -->
            <div class="col-sm-70">
                <jsonforms schema="element.selectedSchema" data="element.selectedChild" ng-if="element.selectedChild"></jsonforms>
            </div>
        </div>
        `;
        control['schema']=subSchema;
        control['filter']=(properties) => {
            var result = {};
            angular.forEach(properties, (value, key) => {
                if (value.type=='array' && value.items.type=='object') {
                    result[key] = value;
                }
            });
            return result;
        };
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "MasterDetailLayout" && jsonSchema !== undefined && jsonSchema.type == 'object';
    }
}

export default angular
    .module('jsonforms.renderers.layouts.masterdetail')
    .run(['RenderService', (RenderService) =>
        RenderService.register(new MasterDetailRenderer())
    ])
    .name;
