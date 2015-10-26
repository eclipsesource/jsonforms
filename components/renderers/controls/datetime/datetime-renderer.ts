///<reference path="../../../../typings/schemas/uischema.d.ts"/>
///<reference path="../../jsonforms-renderers.d.ts"/>
///<reference path="../../renderers-service.ts"/>

class DatetimeRenderer implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
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
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    }
}

angular.module('jsonforms.renderers.controls.datetime').run(['RenderService', function(RenderService) {
    RenderService.register(new DatetimeRenderer());
}]);
