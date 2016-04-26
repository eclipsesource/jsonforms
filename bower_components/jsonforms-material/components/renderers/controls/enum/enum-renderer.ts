///<reference path="../../../references.ts"/>

class MaterialEnumRenderer implements JSONForms.IRenderer {

    priority = 11;

    constructor(private pathResolver: JSONForms.IPathResolver) {}

    render(element: IControlObject, schema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
        var enums =  subSchema.enum;
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        // Fix for broken css in angular material see comment in https://github.com/angular/material/issues/2793
        control['template'] =
        `<md-input-container flex>
            <label ng-if="element.label" for="{{element.id}}">{{element.label}}</label>
            <md-select data-jsonforms-model aria-label="{{element.label}}">
              <md-option ng-repeat="option in element.options" value="{{option}}" id="${schemaPath}">
                {{option}}
              </md-option>
            </md-select>
        </md-input-container>
        `;
        /*
        `<jsonforms-material-control>
            <md-select data-jsonforms-model aria-label="{{element.label}}">
                <md-option ng-repeat="option in element.options" value="{{option}}" id="${schemaPath}">
                    {{option}}
                </md-option>
            </md-select>
        </jsonforms-material-control>`;
        */
        control['options'] = enums;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.hasOwnProperty('enum');
    }
}

angular.module('jsonforms-material.renderers.controls.enum').run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new MaterialEnumRenderer(PathResolver));
}]);
