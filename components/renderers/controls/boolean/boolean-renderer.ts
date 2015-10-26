///<reference path="../../../../typings/schemas/uischema.d.ts"/>
///<reference path="../../jsonforms-renderers.d.ts"/>
///<reference path="../../renderers-service.ts"/>

class BooleanRenderer implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<control><input type="checkbox" id="${schemaPath}" class="jsf-control jsf-control-boolean" ui-validate="\'element.validate($value)\'" data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    }
}

angular.module('jsonforms.renderers.controls.boolean').run(['RenderService', function(RenderService) {
    RenderService.register(new BooleanRenderer());
}]);
