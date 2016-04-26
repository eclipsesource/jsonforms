///<reference path="../../../references.ts"/>

class MaterialDatetimeRenderer implements JSONForms.IRenderer {

    priority = 10;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath,  services, element);
        var label = element.label ? element.label : "";
        control['template'] =
        `
        <!--the css class is a temporary fix for https://github.com/angular/material/issues/4233-->
        <div flex class="material-jsf-input-container">
            <label ng-if="element.label" for="{{element.id}}">{{element.label}}</label>
            <md-datepicker id="${schemaPath}" data-jsonforms-model md-placeholder="{{element.label}}"></md-datepicker>
        </div>
        `;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    }

}

angular.module('jsonforms-material.renderers.controls.datetime').run(['RenderService', function(RenderService) {
    RenderService.register(new MaterialDatetimeRenderer());
}]);
