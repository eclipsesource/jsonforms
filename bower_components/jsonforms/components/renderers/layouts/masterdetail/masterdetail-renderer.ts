///<reference path="../../../references.ts"/>

class MasterDetailRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor() { }

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `
        <div class="row">
            <!-- Master -->
            <div class="col-sm-30">
                <jsonforms-masterdetail-collection element="element" collection="element.schema.properties"></jsonforms-masterdetail-collection>
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

angular.module('jsonforms.renderers.layouts.masterdetail').run(['RenderService', (RenderService) => {
    RenderService.register(new MasterDetailRenderer());
}]);
