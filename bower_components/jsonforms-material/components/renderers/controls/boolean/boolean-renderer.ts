///<reference path="../../../references.ts"/>

class MaterialBooleanRenderer implements JSONForms.IRenderer {

    priority = 10;

    render(element: IControlObject , subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath,  services, element);
        var label = element.label ? element.label : "";
        control['template'] =
        `
        <!--the css class is a temporary fix for https://github.com/angular/material/issues/1268-->
        <md-input-container flex class="md-input-has-value">
            <label ng-if="element.label" for="{{element.id}}">{{element.label}}</label>
            <md-checkbox id="${schemaPath}" class="md-primary" aria-label="{{element.label}}" data-jsonforms-validation data-jsonforms-model/></md-checkbox>
        </md-input-container>
        `;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'boolean';
    }
}

angular.module('jsonforms-material.renderers.controls.boolean').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialBooleanRenderer());
}]);
