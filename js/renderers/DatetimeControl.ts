///<reference path="..\services.ts"/>

class DatetimeControl implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['templateUrl'] = '../templates/datetime.html';
        control['isOpen'] = false;
        control['openDate'] = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            control['isOpen'] = true;
        };
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    }
}

var app = angular.module('jsonForms.datetimeControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new DatetimeControl());
}]);