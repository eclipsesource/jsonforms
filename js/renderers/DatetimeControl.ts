///<reference path="..\services.ts"/>

class DatetimeControl implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element.label);
        control['isOpen'] = false;
        control['openDate'] = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            control['isOpen'] = true;
        };
        control['template'] =
            `<control><div class="input-group">
              <input type="text" datepicker-popup="dd.MM.yyyy" close-text="Close" is-open="element.isOpen" id="${schemaPath}" class="form-control jsf-control jsf-control-datetime" data-jsonforms-model/>
                 <span class="input-group-btn">
                   <button type="button" class="btn btn-default" ng-click="element.openDate($event)">
                     <i class="glyphicon glyphicon-calendar"></i>
                   </button>
                 </span>
            </div></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    }
}

var app = angular.module('jsonforms.datetimeControl', []);

app.run(['RenderService', 'RenderDescriptionFactory', (RenderService) =>
    RenderService.register(new DatetimeControl())
]);
