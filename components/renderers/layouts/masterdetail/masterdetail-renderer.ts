///<reference path="../../../references.ts"/>

class MasterDetailRenderer implements JSONForms.IRenderer {

    priority = 1;

    constructor(private renderService: JSONForms.IRenderService) { }

    render(element: IUISchemaElement, subSchema: SchemaArray, schemaPath: string, services: JSONForms.Services): JSONForms.IContainerRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, "");

        var template = `
        <div class="row">
        <!-- Master -->
        <div class="col-sm-30">
            <button class="col-sm-99" ng-repeat="child in element.instance" ng-click="element.selectedChild=child">{{child.name}}_{{$index}}</button>
        </div>
        <!-- Detail -->
        <div class="col-sm-70"><jsonforms schema="element.childSchema" data="element.selectedChild"></jsonforms></div>
        </div>
        `;
        control['template'] = template;
        control['childSchema']=subSchema.items;
        control['selectedChild']=control.instance[0];
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath): boolean {
        return uiElement.type == "MasterDetailLayout" && jsonSchema !== undefined && jsonSchema.type == 'array';
    }
}

angular.module('jsonforms.renderers.layouts.masterdetail').run(['RenderService', (RenderService) => {
    RenderService.register(new MasterDetailRenderer(RenderService));
}]);
